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
  UserPlus,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  ExternalLink,
  RefreshCw,
  LogOut,
  AlertCircle,
  Copy,
  Check,
  Share2,
  Eye,
  Users,
  Award,
  GraduationCap,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  FileCheck2,
  Calendar
} from 'lucide-react';

interface InstructorDashboardProps {
  roster: ApprenticeRecord[];
  activeProfile: ApprenticeProfile;
  onSelectActiveProfile: (record: ApprenticeRecord) => void;
  onAddOrUpdateRecord: (record: ApprenticeRecord) => void;
  onDeleteRecord: (id: string) => void;
  onSwitchToApprenticeView: () => void;
  onExitToLanding?: () => void;
  onTriggerToast: (message: string, type: 'xp' | 'badge' | 'theme') => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  roster,
  activeProfile,
  onSelectActiveProfile,
  onAddOrUpdateRecord,
  onDeleteRecord,
  onSwitchToApprenticeView,
  onExitToLanding,
  onTriggerToast
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Certificado' | 'En Proceso'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Google Sheets & Drive state (exclusively managed by the Instructor)
  const [googleUser, setGoogleUser] = useState<User | null>(auth.currentUser);
  const [sheetInfo, setSheetInfo] = useState<SheetMetadata | null>(() => {
    const saved = localStorage.getItem('sena_google_sheet_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
  const [isSyncingWithSheets, setIsSyncingWithSheets] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
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

  // Form for manually adding apprentice
  const [formData, setFormData] = useState({
    name: '',
    docType: 'CC' as DocType,
    docNumber: '',
    program: activeProfile.program || 'ADSO - Análisis y Desarrollo de Software',
    fichaNumber: activeProfile.fichaNumber || '2874921',
    regional: activeProfile.regional || 'Distrito Capital',
    center: activeProfile.center || 'Centro de Tecnologías del Transporte - Regional D.C.'
  });

  // Filtered roster
  const filteredRoster = roster.filter((learner) => {
    const matchesSearch =
      learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      learner.docNumber.includes(searchTerm) ||
      learner.fichaNumber.includes(searchTerm) ||
      learner.program.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || learner.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Metric stats
  const totalCount = roster.length;
  const certifiedCount = roster.filter((r) => r.status === 'Certificado').length;
  const inProgressCount = totalCount - certifiedCount;
  const certificationRate =
    totalCount > 0 ? Math.round((certifiedCount / totalCount) * 100) : 0;
  const averageScore =
    totalCount > 0
      ? Math.round(
          roster.reduce((acc, curr) => acc + (curr.scorePercentage || 0), 0) / totalCount
        )
      : 0;

  // Copy shareable link for apprentices
  const handleCopyApprenticeLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('role', 'aprendiz');
    navigator.clipboard.writeText(url.toString()).then(() => {
      setLinkCopied(true);
      onTriggerToast('¡Enlace de aprendices copiado! Compártelo con la ficha', 'xp');
      setTimeout(() => setLinkCopied(false), 3500);
    });
  };

  // Connect Google account via OAuth
  const handleConnectGoogle = async () => {
    setIsConnectingGoogle(true);
    setSyncStatusMsg(null);
    try {
      const { user, accessToken } = await signInWithGoogle();
      setGoogleUser(user);
      setSyncStatusMsg({
        text: `Conectado como instructor (${user.email}). Sincronizando hoja en Google Drive...`,
        type: 'info'
      });
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
      text: 'Cuenta de Google desvinculada del panel del instructor.',
      type: 'info'
    });
  };

  // Synchronize entire roster to Google Sheets
  const handleSyncToGoogleSheets = async (forcedToken?: string) => {
    const token = forcedToken || getAccessToken();
    if (!token) {
      await handleConnectGoogle();
      return;
    }

    setIsSyncingWithSheets(true);
    setSyncStatusMsg(null);
    try {
      const metadata = await getOrCreateInductionSpreadsheet(token, activeProfile.fichaNumber);
      setSheetInfo(metadata);

      const { rowsUpdated } = await syncRosterToGoogleSheet(metadata.spreadsheetId, roster, token);

      const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
      setLastSyncTime(now);
      localStorage.setItem('sena_google_sheet_last_sync', now);

      setSyncStatusMsg({
        text: `¡Hoja sincronizada correctamente! ${rowsUpdated} aprendices registrados en "${metadata.title}"`,
        type: 'success'
      });
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({
        text: err?.message || 'Error al sincronizar con Google Sheets',
        type: 'error'
      });
    } finally {
      setIsSyncingWithSheets(false);
    }
  };

  // Export to CSV
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

  // Copy table to clipboard
  const handleCopyTable = () => {
    const headers = [
      'Nombre Completo\tTipo Doc\tNúmero Doc\tFicha\tPrograma\tEstado\tPuntaje (%)\tXP\tMedallas\tCódigo Certificado\tÚltima Actualización'
    ];
    const rows = roster.map((item) =>
      [
        item.name,
        item.docType,
        item.docNumber,
        item.fichaNumber,
        item.program,
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Instructor Header Banner */}
      <div className="bg-gradient-to-r from-[#00324D] via-[#00476e] to-[#00324D] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Panel de Control del Instructor
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/10 text-emerald-300 border border-white/10">
                Ficha {activeProfile.fichaNumber || '2874921'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Seguimiento y Configuración de Inducción SENA
            </h1>
            <p className="text-sm text-slate-200 dark:text-slate-300 mt-1 max-w-2xl">
              Administra la sincronización centralizada con Google Drive, supervisa el avance de
              los aprendices de la ficha y genera el enlace para que ellos realicen su proceso.
            </p>
          </div>

          {/* Quick Action Buttons for Instructor */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyApprenticeLink}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                linkCopied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white hover:bg-slate-100 text-[#00324D]'
              }`}
              title="Copiar enlace directo para compartir con los aprendices"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>¡Enlace Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-emerald-700" />
                  <span>Copiar Enlace para Aprendices</span>
                </>
              )}
            </button>

            <button
              onClick={onSwitchToApprenticeView}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#39A900] hover:bg-emerald-600 text-white flex items-center gap-2 transition-all shadow-md cursor-pointer"
              title="Ver la plataforma tal como la experimenta el aprendiz"
            >
              <Eye className="w-4 h-4" />
              <span>Vista de Aprendiz</span>
            </button>

            {onExitToLanding && (
              <button
                onClick={onExitToLanding}
                className="px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/60 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                title="Cerrar sesión y volver a la pantalla de selección de rol"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Salir</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Google Sheets & Drive Privileged Synchronization Card (Instructor Exclusive) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Vinculación de Hoja de Cálculo en Google Drive
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Exclusivo Instructor
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Los aprendices no tienen acceso a esta configuración. Cuando ellos avanzan en la
                plataforma, sus datos se transmiten automáticamente a tu hoja.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {googleUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSyncToGoogleSheets()}
                  disabled={isSyncingWithSheets}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithSheets ? 'animate-spin' : ''}`} />
                  <span>{isSyncingWithSheets ? 'Sincronizando...' : 'Sincronizar a Google Sheets'}</span>
                </button>
                <button
                  onClick={handleDisconnectGoogle}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Desvincular cuenta de Google"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectGoogle}
                disabled={isConnectingGoogle}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
                <span>{isConnectingGoogle ? 'Conectando...' : 'Vincular mi Cuenta de Google Drive'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Integration Status Sub-strip */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            {googleUser ? (
              <div className="flex items-center gap-2.5">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || 'Instructor'}
                    className="w-7 h-7 rounded-full border border-emerald-500"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    {googleUser.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )}
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {googleUser.email}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Google Drive Conectado • Sincronización Automática Activa
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Conecta tu cuenta de Google para crear y gestionar la hoja de cálculo de la ficha.</span>
              </div>
            )}
          </div>

          {sheetInfo && (
            <div className="flex items-center gap-3">
              {lastSyncTime && (
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Última sincronización: <strong>{lastSyncTime}</strong>
                </span>
              )}
              <a
                href={sheetInfo.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir Hoja en Google Drive</span>
              </a>
            </div>
          )}
        </div>

        {/* Sync notification message banner */}
        {syncStatusMsg && (
          <div
            className={`mt-3 px-4 py-2 rounded-xl text-xs flex items-center justify-between gap-2 border animate-in fade-in ${
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
                <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
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
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Aprendices</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Certificados</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {certifiedCount}
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                ({certificationRate}%)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">En Progreso</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{inProgressCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Promedio Evaluación</p>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{averageScore}%</p>
          </div>
        </div>
      </div>

      {/* Roster & Table Control Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Table Action Bar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar aprendiz, documento o ficha..."
                className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-64 sm:w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Todos los Estados ({totalCount})</option>
              <option value="Certificado">Solo Certificados ({certifiedCount})</option>
              <option value="En Proceso">En Progreso ({inProgressCount})</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>{showAddForm ? 'Cerrar Formulario' : 'Agregar Aprendiz'}</span>
            </button>

            <button
              onClick={handleCopyTable}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Copiar datos al portapapeles para pegar en Excel o Sheets"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copyFeedback ? '¡Copiado!' : 'Copiar Tabla'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Descargar archivo .CSV con el registro completo de aprendices"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .CSV</span>
            </button>
          </div>
        </div>

        {/* Add Apprentice Form Dropdown */}
        {showAddForm && (
          <form
            onSubmit={handleAddNewApprentice}
            className="p-5 bg-emerald-50/70 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/40 text-xs animate-in fade-in"
          >
            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-1.5">
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                    className="w-full px-2 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Guardar Aprendiz
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold bg-slate-50/70 dark:bg-slate-800/40">
                <th className="py-3 px-4">Aprendiz</th>
                <th className="py-3 px-4">Documento</th>
                <th className="py-3 px-4">Ficha / Programa</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Evaluación</th>
                <th className="py-3 px-4 text-center">XP</th>
                <th className="py-3 px-4">Código Certificado</th>
                <th className="py-3 px-4">Última Actualización</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredRoster.map((item) => {
                const isActive = item.docNumber === activeProfile.docNumber;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      isActive ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {isActive && (
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                            Activo
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {item.docType} {item.docNumber}
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.fichaNumber}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 block truncate">
                        {item.program}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {item.status === 'Certificado' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Certificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                          <Clock className="w-3.5 h-3.5" />
                          En Proceso
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center font-bold">
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

                    <td className="py-3 px-4 text-center font-bold text-purple-600 dark:text-purple-400">
                      {item.xp} XP
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {item.verificationCode || 'PENDIENTE'}
                    </td>

                    <td className="py-3 px-4 text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(item.updatedAt).toLocaleDateString('es-CO')}{' '}
                      {new Date(item.updatedAt).toLocaleTimeString('es-CO', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectActiveProfile(item);
                            onSwitchToApprenticeView();
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 transition-colors cursor-pointer"
                          title="Ver progreso y certificado de este aprendiz"
                        >
                          Ver Detalle
                        </button>
                        {roster.length > 1 && (
                          <button
                            onClick={() => onDeleteRecord(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Eliminar aprendiz de la lista"
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
              No se encontraron aprendices que coincidan con la búsqueda o filtro seleccionado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
