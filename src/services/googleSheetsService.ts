/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { ApprenticeRecord } from '../types/induction';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// In-memory token cache with sessionStorage backing for seamless tab/refresh persistence
const TOKEN_SESSION_KEY = 'sena_gsheets_access_token';
const SHEET_INFO_STORAGE_KEY = 'sena_google_sheet_info';
const LAST_SYNC_STORAGE_KEY = 'sena_google_sheet_last_sync';

let inMemoryAccessToken: string | null =
  typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_SESSION_KEY) : null;

// Target scopes required for Drive & Sheets
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets'
];

export interface SheetMetadata {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

/**
 * Sign in with Google using popup and request required scopes
 */
export async function signInWithGoogle(): Promise<{ user: User; accessToken: string }> {
  const provider = new GoogleAuthProvider();
  SCOPES.forEach((scope) => provider.addScope(scope));

  provider.setCustomParameters({
    prompt: 'consent'
  });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) {
    throw new Error('No se pudo obtener el token de acceso para Google Drive / Sheets');
  }

  setAccessToken(token);

  // Automatically flush any pending silent queue
  processSilentQueue();

  return { user: result.user, accessToken: token };
}

/**
 * Sign out from Google account and clear token
 */
export async function signOutFromGoogle(): Promise<void> {
  await firebaseSignOut(auth);
  setAccessToken(null);
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  if (!inMemoryAccessToken && typeof window !== 'undefined') {
    inMemoryAccessToken = sessionStorage.getItem(TOKEN_SESSION_KEY);
  }
  return inMemoryAccessToken;
}

/**
 * Set access token and sync with sessionStorage for seamless session persistence
 */
export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem(TOKEN_SESSION_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_SESSION_KEY);
    }
  }
}

/**
 * Retrieve saved SheetMetadata from localStorage
 */
export function getSavedSheetInfo(): SheetMetadata | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(SHEET_INFO_STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

/**
 * Save SheetMetadata to localStorage
 */
export function saveSheetInfo(info: SheetMetadata) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHEET_INFO_STORAGE_KEY, JSON.stringify(info));
}

/**
 * Search Google Drive for an existing induction spreadsheet or create a new one
 */
export async function getOrCreateInductionSpreadsheet(
  accessToken: string,
  fichaNumber: string = '2874921'
): Promise<SheetMetadata> {
  // Check if we already have a valid saved spreadsheet ID in local storage
  const saved = getSavedSheetInfo();
  if (saved && saved.spreadsheetId) {
    // Quickly verify it's still accessible
    try {
      const checkRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${saved.spreadsheetId}?fields=spreadsheetId,properties.title`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (checkRes.ok) {
        return saved;
      }
    } catch {
      // Fallback to searching / creating
    }
  }

  const sheetTitle = `Registro de Aprendices - Inducción SENA (Ficha ${fichaNumber})`;

  // 1. Search in Drive
  const query = encodeURIComponent(
    `name = '${sheetTitle}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
  );

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!searchRes.ok) {
    if (searchRes.status === 401) {
      setAccessToken(null);
      throw new Error('Sesión de Google expirada. Por favor vuelve a conectar tu cuenta.');
    }
    const errText = await searchRes.text();
    console.error('Error buscando hoja en Google Drive:', errText);
  } else {
    const searchData = await searchRes.json();
    if (searchData.files && searchData.files.length > 0) {
      const existing = searchData.files[0];
      const metadata: SheetMetadata = {
        spreadsheetId: existing.id,
        spreadsheetUrl:
          existing.webViewLink || `https://docs.google.com/spreadsheets/d/${existing.id}/edit`,
        title: existing.name
      };
      saveSheetInfo(metadata);
      return metadata;
    }
  }

  // 2. Create new spreadsheet if not found
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: sheetTitle
      },
      sheets: [
        {
          properties: {
            title: 'Aprendices',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    if (createRes.status === 401) {
      setAccessToken(null);
      throw new Error('Sesión de Google expirada. Por favor vuelve a conectar tu cuenta.');
    }
    const errData = await createRes.json();
    throw new Error(errData?.error?.message || 'Error al crear la hoja en Google Sheets');
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl =
    createdData.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  const metadata: SheetMetadata = {
    spreadsheetId,
    spreadsheetUrl,
    title: sheetTitle
  };

  saveSheetInfo(metadata);

  // Apply header styling and title row
  await formatSpreadsheetHeaders(spreadsheetId, accessToken);

  return metadata;
}

/**
 * Format headers in Google Sheets with institutional SENA green styling
 */
export async function formatSpreadsheetHeaders(spreadsheetId: string, accessToken: string) {
  const headers = [
    'ID Registro',
    'Nombres y Apellidos',
    'Tipo Doc',
    'Número Documento',
    'Ficha SENA',
    'Programa de Formación',
    'Regional',
    'Centro de Formación',
    'Estado Inducción',
    'Puntaje Evaluación (%)',
    'XP Ganados',
    'Medallas',
    'Código Certificado',
    'Fecha Registro',
    'Última Actualización'
  ];

  // Set Header values
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices!A1:O1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: 'Aprendices!A1:O1',
        majorDimension: 'ROWS',
        values: [headers]
      })
    }
  );

  // Style Header Row with institutional SENA color (#39A900)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 15
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.223,
                    green: 0.662,
                    blue: 0.0
                  },
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    bold: true,
                    fontSize: 11
                  },
                  horizontalAlignment: 'CENTER'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: 0,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: 15
              }
            }
          }
        ]
      })
    });
  } catch (err) {
    console.warn('Formato de celdas omitido, datos preservados:', err);
  }
}

/**
 * Format a single ApprenticeRecord into a 15-column array matching the sheet headers
 */
function recordToRowValues(item: ApprenticeRecord): (string | number)[] {
  return [
    item.id,
    item.name,
    item.docType,
    item.docNumber,
    item.fichaNumber,
    item.program,
    item.regional,
    item.center,
    item.status,
    item.scorePercentage,
    item.xp,
    item.badgesEarned,
    item.verificationCode || 'PENDIENTE',
    new Date(item.registeredAt).toLocaleDateString('es-CO') +
      ' ' +
      new Date(item.registeredAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
    new Date(item.updatedAt || Date.now()).toLocaleDateString('es-CO') +
      ' ' +
      new Date(item.updatedAt || Date.now()).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit'
      })
  ];
}

/**
 * Update a specific apprentice's row in real-time, or append if it doesn't exist yet
 * Guaranteeing: "Una fila por aprendiz actualizada en tiempo real"
 */
export async function updateOrAppendApprenticeRow(
  spreadsheetId: string,
  apprentice: ApprenticeRecord,
  accessToken: string
): Promise<{ row: number; action: 'updated' | 'appended' }> {
  // 1. Read column D (Document Numbers) to locate the apprentice row
  const getColRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices!D2:D500`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  let targetRowIndex = -1;

  if (getColRes.ok) {
    const colData = await getColRes.json();
    const rows = colData.values || [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i] && String(rows[i][0]).trim() === String(apprentice.docNumber).trim()) {
        targetRowIndex = i + 2; // +2 because D2 is 0-index + 2 in 1-indexed sheet
        break;
      }
    }
  }

  const rowValues = recordToRowValues(apprentice);

  if (targetRowIndex > 0) {
    // Row exists: UPDATE the row in real-time
    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices!A${targetRowIndex}:O${targetRowIndex}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          range: `Aprendices!A${targetRowIndex}:O${targetRowIndex}`,
          majorDimension: 'ROWS',
          values: [rowValues]
        })
      }
    );

    if (!updateRes.ok) {
      if (updateRes.status === 401) {
        setAccessToken(null);
      }
      throw new Error(`Error actualizando fila ${targetRowIndex} en Google Sheets`);
    }

    return { row: targetRowIndex, action: 'updated' };
  } else {
    // Row does not exist: APPEND new row at the bottom
    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices!A:O:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      }
    );

    if (!appendRes.ok) {
      if (appendRes.status === 401) {
        setAccessToken(null);
      }
      throw new Error('Error al añadir fila de aprendiz en Google Sheets');
    }

    return { row: 0, action: 'appended' };
  }
}

/**
 * Synchronize the entire apprentice roster to the Google Sheet (Manual or Initial Sync)
 */
export async function syncRosterToGoogleSheet(
  spreadsheetId: string,
  roster: ApprenticeRecord[],
  accessToken: string
): Promise<{ rowsUpdated: number }> {
  // Clear existing data rows (A2:O500)
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices!A2:O500:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (roster.length === 0) {
    return { rowsUpdated: 0 };
  }

  const values = roster.map(recordToRowValues);
  const endRow = values.length + 1;

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices!A2:O${endRow}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: `Aprendices!A2:O${endRow}`,
        majorDimension: 'ROWS',
        values: values
      })
    }
  );

  if (!updateRes.ok) {
    if (updateRes.status === 401) {
      setAccessToken(null);
      throw new Error('Sesión expirada. Por favor reconecta tu cuenta de Google.');
    }
    const errData = await updateRes.json();
    throw new Error(errData?.error?.message || 'Error al actualizar filas en Google Sheets');
  }

  return { rowsUpdated: values.length };
}

// =========================================================================
// SILENT BACKGROUND QUEUE FOR REAL-TIME INDUCTION MILESTONES
// Completely silent in the UI (no popups, no blocking toasts)
// =========================================================================

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const pendingQueue: Map<string, ApprenticeRecord> = new Map();
let isQueueProcessing = false;

/**
 * Queue an apprentice record for silent real-time sync with Google Sheets.
 * Triggers automatically at apprentice milestones:
 * - Profile saved / edited
 * - Induction module completed
 * - Final exam passed & certified
 */
export function queueSilentApprenticeSync(record: ApprenticeRecord) {
  if (!record || !record.docNumber) return;

  // Update or insert into pending map by document number
  pendingQueue.set(record.docNumber, { ...record, updatedAt: new Date().toISOString() });

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // 1200ms debounce to consolidate rapid successive changes
  debounceTimer = setTimeout(() => {
    processSilentQueue();
  }, 1200);
}

/**
 * Process the queue silently in the background
 */
async function processSilentQueue(): Promise<void> {
  if (isQueueProcessing || pendingQueue.size === 0) return;

  const token = getAccessToken();
  if (!token) {
    // Waiting for token: will process automatically upon sign-in
    return;
  }

  isQueueProcessing = true;
  try {
    // 1. Get or locate spreadsheet
    const metadata = await getOrCreateInductionSpreadsheet(token);
    if (!metadata || !metadata.spreadsheetId) {
      isQueueProcessing = false;
      return;
    }

    // 2. Process each queued record sequentially to preserve order
    const recordsToSync = Array.from(pendingQueue.values());
    for (const record of recordsToSync) {
      try {
        await updateOrAppendApprenticeRow(metadata.spreadsheetId, record, token);
        pendingQueue.delete(record.docNumber);
      } catch (err) {
        console.warn(`[SilentSync] Error actualizando aprendiz ${record.docNumber}:`, err);
        break; // Stop and retry later if network/token issue
      }
    }

    if (typeof window !== 'undefined') {
      const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem(LAST_SYNC_STORAGE_KEY, now);
    }
  } catch (err) {
    console.warn('[SilentSync] Proceso silencioso detenido:', err);
  } finally {
    isQueueProcessing = false;
  }
}
