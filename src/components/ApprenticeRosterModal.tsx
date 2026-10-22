/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ApprenticeRecord, ApprenticeProfile, DocType } from '../types/induction';
import {
  signInWithGoogle,
  signOutFromGoogle,
  getOrCreateInductionSpreadsheet,
  syncRosterToGoogleSheet,
  getAccessToken,
  SheetMetadata,
  auth
} from '../services/googleSheetsService';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  FileSpreadsheet,
  Download,
  Upload,
  UserPlus,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  X,
  FileCheck2,
  Award,
  Users,
  Copy,
  ExternalLink,
  Info,
  RefreshCw,
  LogOut,
  AlertCircle
} from 'lucide-react';

interface ApprenticeRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  roster: ApprenticeRecord[];
  activeProfile: ApprenticeProfile;
  onSelectActiveProfile: (record: ApprenticeRecord) => void;
  onAddOrUpdateRecord: (record: ApprenticeRecord) => void;
  onDeleteRecord: (id: string) => void;
  isCertified: boolean;
  scorePercentage: number;
  xp: number;
  badgesCount: number;
}

export const ApprenticeRosterModal: React.FC<ApprenticeRosterModalProps> = ({
  isOpen,
  onClose,
  roster,
  activeProfile,
  onSelectActiveProfile,
  onAddOrUpdateRecord,
  onDeleteRecord,
  isCertified,
  scorePercentage,
  xp,
  badgesCount,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Certificado' | 'En Proceso'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Google Sheets & Drive state
  const [googleUser, setGoogleUser] = useState<User | null>(auth.currentUser);
  const [sheetInfo, setSheetInfo] = useState<SheetMetadata | null>(() => {
    const saved = localStorage.getItem('sena_google_sheet_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isSyncingWithSheets, setIsSyncingWithSheets] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('sena_google_sheet_last_sync') || null;
  });

  // Track auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setGoogleUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Save sheet info to localStorage for quick link recovery
  useEffect(() => {
    if (sheetInfo) {
      localStorage.setItem('sena_google_sheet_info', JSON.stringify(sheetInfo));
    }
  }, [sheetInfo]);

  // New apprentice form state
  const [formData, setFormData] = useState({
    name: '',
    docType: 'CC' as DocType,
    docNumber: '',
    program: activeProfile.program || 'ADSO - Análisis y Desarrollo de Software',
    fichaNumber: activeProfile.fichaNumber || '2874921',
    regional: activeProfile.regional || 'Distrito Capital',
    center: activeProfile.center || 'Centro de Tecnologías del Transporte - Regional D.C.',
  });

  if (!isOpen) return null;

  // Filtered apprentices
  const filteredRoster = roster.filter((learner) => {
    const matchesSearch =
      learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.docNumber.includes(searchTerm) ||
      learner.fichaNumber.includes(searchTerm) ||
      learner.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || learner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Totals
  const totalCount = roster.length;
  const certifiedCount = roster.filter((r) => r.status === 'Certificado').length;
  const inProgressCount = totalCount - certifiedCount;
  const averageScore =
    totalCount > 0
      ? Math.round(
          roster.reduce((acc, curr) => acc + (curr.scorePercentage || 0), 0) /
            totalCount
        )
      : 0;

  // Connect Google account via OAuth popup
  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    setSyncStatusMsg(null);
    try {
      const { user, accessToken } = await signInWithGoogle();
      setGoogleUser(user);
      setSyncStatusMsg({
        text: `Conectado como ${user.email}. Listo para sincronizar con Google Drive.`,
        type: 'info'
      });
      // Automatically prompt or execute initial sync
      await handleSyncToGoogleSheets(accessToken);
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({
        text: err?.message || 'Error al conectar con la cuenta de Google',
        type: 'error'
      });
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  // Disconnect Google account
  const handleDisconnectGoogle = async () => {
    await signOutFromGoogle();
    setGoogleUser(null);
    setSyncStatusMsg({
      text: 'Cuenta de Google desvinculada de la sesión actual.',
      type: 'info'
    });
  };

  // Synchronize roster to Google Sheet
  const handleSyncToGoogleSheets = async (forcedToken?: string) => {
    const token = forcedToken || getAccessToken();
    if (!token) {
      // Prompt sign in first
      await handleConnectGoogle();
      return;
    }

    setIsSyncingWithSheets(true);
    setSyncStatusMsg(null);
    try {
      // 1. Get or create spreadsheet
      const metadata = await getOrCreateInductionSpreadsheet(token, activeProfile.fichaNumber);
      setSheetInfo(metadata);

      // 2. Sync all records
      const { rowsUpdated } = await syncRosterToGoogleSheet(metadata.spreadsheetId, roster, token);

      const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(now);
      localStorage.setItem('sena_google_sheet_last_sync', now);

      setSyncStatusMsg({
        text: `¡Sincronizado con éxito! ${rowsUpdated} aprendices registrados en "${metadata.title}"`,
        type: 'success'
      });
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({
        text: err?.message || 'Error al sincronizar datos con Google Sheets',
        type: 'error'
      });
    } finally {
      setIsSyncingWithSheets(false);
    }
  };

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'ID Registro',
      'Nombre Completo',
      'Tipo Doc',
      'Numero Documento',
      'Ficha SENA',
      'Programa de Formacion',
      'Regional',
      'Centro de Formacion',
      'Estado Induccion',
      'Puntaje Evaluacion (%)',
      'XP Puntos',
      'Medallas Obtenidas',
      'Codigo Certificado',
      'Fecha Registro',
      'Fecha Ultima Actualizacion'
    ];

    const rows = roster.map((item) => [
      `"${item.id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.docType}"`,
      `"${item.docNumber}"`,
      `"${item.fichaNumber}"`,
      `"${item.program.replace(/"/g, '""')}"`,
      `"${item.regional.replace(/"/g, '""')}"`,
      `"${item.center.replace(/"/g, '""')}"`,
      `"${item.status}"`,
      item.scorePercentage,
      item.xp,
      item.badgesEarned,
      `"${item.verificationCode || 'PENDIENTE'}"`,
      `"${new Date(item.registeredAt).toLocaleDateString('es-CO')} ${new Date(item.registeredAt).toLocaleTimeString('es-CO')}"`,
      `"${new Date(item.updatedAt).toLocaleDateString('es-CO')} ${new Date(item.updatedAt).toLocaleTimeString('es-CO')}"`
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `aprendices_induccion_sena_ficha_${activeProfile.fichaNumber || 'general'}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy data to clipboard formatted for quick paste
  const handleCopyForSheets = () => {
    const headers = [
      'Nombre Completo\tTipo Doc\tNúmero Doc\tFicha\tPrograma\tRegional\tCentro\tEstado\tPuntaje (%)\tXP\tMedallas\tCódigo Certificado\tFecha'
    ];
    const rows = roster.map((item) =>
      [
        item.name,
        item.docType,
        item.docNumber,
        item.fichaNumber,
        item.program,
        item.regional,
        item.center,
        item.status,
        `${item.scorePercentage}%`,
        item.xp,
        item.badgesEarned,
        item.verificationCode || 'PENDIENTE',
        new Date(item.updatedAt).toLocaleDateString('es-CO')
      ].join('\t')
    );

    const tsvContent = [...headers, ...rows].join('\n');
    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    });
  };

  const handleAddNewApprentice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.docNumber.trim()) return;

    const newRecord: ApprenticeRecord = {
      id: `apr-${Date.now()}`,
      name: formData.name.trim(),
      docType: formData.docType,
      docNumber: formData.docNumber.trim(),
      program: formData.program.trim(),
      fichaNumber: formData.fichaNumber.trim(),
      regional: formData.regional.trim(),
      center: formData.center.trim(),
      status: 'En Proceso',
      scorePercentage: 0,
      xp: 50,
      badgesEarned: 0,
      registeredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddOrUpdateRecord(newRecord);
    setFormData({
      name: '',
      docType: 'CC',
      docNumber: '',
      program: activeProfile.program,
      fichaNumber: activeProfile.fichaNumber,
      regional: activeProfile.regional,
      center: activeProfile.center
    });
    setShowAddForm(false);
  };

  // Sync current active profile into the roster
  const handleSyncCurrentActive = () => {
    const updatedRecord: ApprenticeRecord = {
      id: `apr-${activeProfile.docNumber}`,
      name: activeProfile.name,
      docType: activeProfile.docType,
      docNumber: activeProfile.docNumber,
      program: activeProfile.program,
      fichaNumber: activeProfile.fichaNumber,
      regional: activeProfile.regional,
      center: activeProfile.center,
      status: isCertified ? 'Certificado' : 'En Proceso',
      scorePercentage: scorePercentage,
      xp: xp,
      badgesEarned: badgesCount,
      verificationCode: isCertified
        ? `SENA-IND-${activeProfile.fichaNumber}-${activeProfile.docNumber.slice(-4)}`
        : undefined,
      registeredAt: activeProfile.registeredAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onAddOrUpdateRecord(updatedRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#00324D] dark:bg-slate-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-xl shadow-xs">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                Registro de Aprendices de Inducción
                <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Google Sheets & Drive
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Almacenamiento estructurado sincronizado con tu hoja de cálculo en Google Drive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Google Drive & Sheets Integration Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {googleUser ? (
              <div className="flex items-center gap-2">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || 'Google User'}
                    className="w-6 h-6 rounded-full border border-emerald-500"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                    G
                  </div>
                )}
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 block">
                    {googleUser.email}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Google Drive Conectado • Sincronización Automática Activa
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Conecta tu cuenta para sincronizar con Google Drive</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {sheetInfo && (
              <a
                href={sheetInfo.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir en Google Drive</span>
              </a>
            )}

            {googleUser ? (
              <>
                <button
                  onClick={() => handleSyncToGoogleSheets()}
                  disabled={isSyncingWithSheets}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithSheets ? 'animate-spin' : ''}`} />
                  <span>{isSyncingWithSheets ? 'Sincronizando...' : 'Sincronizar a Google Sheets'}</span>
                </button>
                <button
                  onClick={handleDisconnectGoogle}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  title="Desvincular cuenta de Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isConnectingGoogle}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
                <span>{isConnectingGoogle ? 'Conectando...' : 'Vincular Google Drive & Sheets'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatusMsg && (
          <div
            className={`px-4 py-2 text-xs flex items-center justify-between gap-2 border-b animate-in fade-in ${
              syncStatusMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : syncStatusMsg.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {syncStatusMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : syncStatusMsg.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span>{syncStatusMsg.text}</span>
            </div>
            <button
              onClick={() => setSyncStatusMsg(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Total Registrados</p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Certificados</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{certifiedCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">En Progreso</p>
              <p className="text-base font-bold text-amber-600 dark:text-amber-400">{inProgressCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Promedio General</p>
              <p className="text-base font-bold text-purple-600 dark:text-purple-400">{averageScore}%</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, documento o ficha..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-1.5 px-3 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Todos los Estados</option>
              <option value="Certificado">Solo Certificados</option>
              <option value="En Proceso">En Progreso</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncCurrentActive}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Guardar o actualizar los datos del aprendiz activo actual"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              Actualizar Aprendiz Activo
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              {showAddForm ? 'Cerrar Formulario' : 'Agregar Aprendiz'}
            </button>

            <button
              onClick={handleCopyForSheets}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar tabla para pegar directamente en Excel o Google Sheets"
            >
              <Copy className="w-3.5 h-3.5" />
              {copyFeedback ? '¡Copiado!' : 'Copiar Portapapeles'}
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-700 text-white shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar archivo .CSV compatible con Excel y Google Sheets"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar .CSV
            </button>
          </div>
        </div>

        {/* Add Apprentice Form Dropdown */}
        {showAddForm && (
          <form
            onSubmit={handleAddNewApprentice}
            className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/50 text-xs animate-fade-in"
          >
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              Registrar Nuevo Aprendiz en la Ficha
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Carlos Andrés Pérez"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.docType}
                    onChange={(e) => setFormData({ ...formData, docType: e.target.value as DocType })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="CC">CC</option>
                    <option value="TI">TI</option>
                    <option value="CE">CE</option>
                    <option value="PEP">PEP</option>
                    <option value="PPT">PPT</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Número Doc. *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.docNumber}
                    onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                    placeholder="1012345678"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Ficha de Formación
                </label>
                <input
                  type="text"
                  value={formData.fichaNumber}
                  onChange={(e) => setFormData({ ...formData, fichaNumber: e.target.value })}
                  placeholder="2874921"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Programa de Formación
                </label>
                <input
                  type="text"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Guardar en la Hoja
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Table View */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-2.5 px-3">Aprendiz</th>
                <th className="py-2.5 px-3">Documento</th>
                <th className="py-2.5 px-3">Ficha / Programa</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3 text-center">Calificación</th>
                <th className="py-2.5 px-3 text-center">XP</th>
                <th className="py-2.5 px-3">Código Certificado</th>
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredRoster.map((item) => {
                const isActive = item.docNumber === activeProfile.docNumber;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isActive ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {isActive && (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                            Activo
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-mono">
                      {item.docType} {item.docNumber}
                    </td>

                    <td className="py-2.5 px-3 max-w-xs truncate text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.fichaNumber}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 block truncate">
                        {item.program}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      {item.status === 'Certificado' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle className="w-3 h-3" />
                          Certificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                          <Clock className="w-3 h-3" />
                          En Proceso
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center font-bold">
                      {item.scorePercentage > 0 ? (
                        <span
                          className={
                            item.scorePercentage >= 80
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }
                        >
                          {item.scorePercentage}%
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 text-center font-semibold text-purple-600 dark:text-purple-400">
                      {item.xp} XP
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {item.verificationCode || 'PENDIENTE'}
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!isActive && (
                          <button
                            onClick={() => onSelectActiveProfile(item)}
                            className="px-2 py-1 text-[11px] rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                            title="Cargar a este aprendiz en la plataforma"
                          >
                            Seleccionar
                          </button>
                        )}
                        {roster.length > 1 && (
                          <button
                            onClick={() => onDeleteRecord(item.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredRoster.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs">
              No se encontraron aprendices con ese criterio de búsqueda.
            </div>
          )}
        </div>

        {/* Footer with Google Drive / Sheets instructions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {sheetInfo ? (
                <>
                  Hoja vinculada: <strong className="text-emerald-700 dark:text-emerald-300">{sheetInfo.title}</strong>
                  {lastSyncTime && ` • Último registro: ${lastSyncTime}`}
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Sincronización desatendida: cada hito (perfil, módulos y examen) actualiza la fila del aprendiz en tiempo real.
                  </span>
                </>
              ) : (
                <>
                  Haz clic en <strong>Vincular Google Drive & Sheets</strong> para crear automáticamente la hoja de cálculo en tu unidad y sincronizar a los aprendices.
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
