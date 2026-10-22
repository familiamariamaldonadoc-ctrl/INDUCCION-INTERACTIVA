/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ApprenticeProfile, DocType } from '../types/induction';
import { SENA_PROGRAMS, SENA_REGIONALES } from '../data/senaRegulationData';
import { SenaLogo } from './SenaLogo';
import {
  GraduationCap,
  BookOpen,
  Lock,
  Unlock,
  KeyRound,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Sun,
  Moon,
  Type,
  FileSpreadsheet
} from 'lucide-react';

interface LandingPageProps {
  initialProfile: ApprenticeProfile;
  onEnterAsApprentice: (profile: ApprenticeProfile) => void;
  onEnterAsInstructor: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  fontScale: 'normal' | 'large' | 'xlarge';
  onToggleFontScale: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  initialProfile,
  onEnterAsApprentice,
  onEnterAsInstructor,
  darkMode,
  onToggleDarkMode,
  fontScale,
  onToggleFontScale
}) => {
  // Selected tab in the landing page ('aprendiz' vs 'instructor')
  const [selectedRole, setSelectedRole] = useState<'aprendiz' | 'instructor'>('aprendiz');

  // Apprentice characterization form state (NO password needed)
  const [apprenticeForm, setApprenticeForm] = useState<ApprenticeProfile>({
    name: initialProfile.name || '',
    docType: initialProfile.docType || 'CC',
    docNumber: initialProfile.docNumber || '',
    program: initialProfile.program || 'ADSO - Análisis y Desarrollo de Software',
    fichaNumber: initialProfile.fichaNumber || '2874921',
    regional: initialProfile.regional || 'Distrito Capital',
    center: initialProfile.center || 'Centro de Tecnologías del Transporte - Regional D.C.',
    avatar: 'female-1',
    registeredAt: initialProfile.registeredAt || new Date().toISOString()
  });

  // Instructor password state (Requires Sena1234)
  const [instructorPassword, setInstructorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Apprentice validation error
  const [apprenticeError, setApprenticeError] = useState<string | null>(null);

  // Handle Apprentice characterization submit
  const handleApprenticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apprenticeForm.name.trim()) {
      setApprenticeError('Por favor ingresa tus nombres y apellidos completos.');
      return;
    }
    if (!apprenticeForm.docNumber.trim()) {
      setApprenticeError('Por favor ingresa tu número de documento.');
      return;
    }
    if (!apprenticeForm.fichaNumber.trim()) {
      setApprenticeError('Por favor ingresa el número de ficha asignada.');
      return;
    }

    setApprenticeError(null);
    onEnterAsApprentice({
      ...apprenticeForm,
      registeredAt: apprenticeForm.registeredAt || new Date().toISOString()
    });
  };

  // Handle Instructor password verification
  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instructorPassword.trim() === 'Sena1234') {
      setPasswordError(null);
      onEnterAsInstructor();
    } else {
      setPasswordError('Clave incorrecta. La clave institucional asignada para instructores es: Sena1234');
    }
  };

  const handleRegionalSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = parseInt(e.target.value, 10);
    const selected = SENA_REGIONALES[idx];
    if (selected) {
      setApprenticeForm({
        ...apprenticeForm,
        regional: selected.regional,
        center: selected.center
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300 w-full max-w-full overflow-x-hidden">
      {/* Top Banner Navigation */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-8 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 w-full max-w-full">
          <div className="flex items-center gap-3 min-w-0">
            <SenaLogo showText={true} className="w-12 h-12 shrink-0" variant="green" />
            <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-3 min-w-0">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block truncate">
                Servicio Nacional de Aprendizaje
              </span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block truncate">
                Portal de Inducción Integral (Acuerdo 009 de 2024)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Font scale toggle */}
            <button
              onClick={onToggleFontScale}
              title="Cambiar tamaño de texto"
              className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold px-2.5 py-1.5 rounded-full transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Type className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">
                {fontScale === 'xlarge' ? 'Letra Muy Grande' : fontScale === 'large' ? 'Letra Grande' : 'Letra Normal'}
              </span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 transition-colors cursor-pointer"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center overflow-x-hidden">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-3 w-full max-w-full">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Selección de Rol de Acceso Institucional</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#00324D] dark:text-white tracking-tight break-words max-w-full">
            Plataforma de Inducción SENA
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Por favor, selecciona si vas a ingresar como <strong>Aprendiz</strong> para realizar la inducción
            o como <strong>Instructor</strong> para supervisar las notas y sincronizar con Google Drive.
          </p>

          {/* Role Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/80 dark:border-slate-700 shadow-inner mt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('aprendiz');
                setPasswordError(null);
                setApprenticeError(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedRole === 'aprendiz'
                  ? 'bg-white dark:bg-slate-900 text-[#00324D] dark:text-emerald-400 shadow-md scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Soy Aprendiz (Sin Clave)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('instructor');
                setPasswordError(null);
                setApprenticeError(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedRole === 'instructor'
                  ? 'bg-white dark:bg-slate-900 text-[#00324D] dark:text-emerald-400 shadow-md scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-500" />
              <span>Soy Instructor (Clave: Sena1234)</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Role Details and Expectations */}
          <div className="lg:col-span-5 space-y-4">
            {selectedRole === 'aprendiz' ? (
              <div className="bg-gradient-to-br from-[#00324D] to-[#004b73] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5 border border-emerald-500/20">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                  <GraduationCap className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 block mb-1">
                    Acceso para Aprendices
                  </span>
                  <h2 className="text-2xl font-black">Tu Ruta de Inducción Integral</h2>
                  <p className="text-xs sm:text-sm text-slate-200 mt-2">
                    Ingresa con tus datos de caracterización para iniciar tu proceso formativo.
                    <strong> No necesitas clave</strong>. Al culminar, podrás descargar tu certificado oficial con código de verificación.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 módulos interactivos sobre el nuevo Acuerdo 009 de 2024.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Desafío clasificador y simulador de dilemas éticos.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Evaluación final con expedición de certificado oficial con QR.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Sincronización desatendida hacia la hoja de tu instructor.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 text-[11px] text-emerald-200 border border-white/10 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>Tus datos se vincularán al certificado que expide el SENA.</span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-900 to-[#00324D] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5 border border-amber-500/20">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md">
                  <Lock className="w-7 h-7" />
                </div>

                <div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 block mb-1">
                    Acceso para Instructores
                  </span>
                  <h2 className="text-2xl font-black">Panel de Control y Gestión</h2>
                  <p className="text-xs sm:text-sm text-slate-200 mt-2">
                    Accede a las herramientas privilegiadas para gestionar la ficha, conectar Google Drive y supervisar el avance de tus aprendices.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Vincular y sincronizar la hoja de cálculo en Google Drive.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Supervisar en tiempo real notas, medallas y estados de aprobación.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Generar y copiar el enlace directo de acceso para los aprendices.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Descargar reportes y nóminas en formato Excel / CSV.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-200 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Clave institucional de instructor requerida: <strong>Sena1234</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            {selectedRole === 'aprendiz' ? (
              /* APPRENTICE CHARACTERIZATION FORM (NO PASSWORD) */
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-emerald-600" />
                      <span>Datos de Caracterización del Aprendiz</span>
                    </h3>
                    <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full uppercase">
                      Sin Clave
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Ingresa tus datos exactamente como aparecen en tu documento para la expedición de tu certificado.
                  </p>
                </div>

                {apprenticeError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{apprenticeError}</span>
                  </div>
                )}

                <form onSubmit={handleApprenticeSubmit} className="space-y-4 text-xs">
                  {/* Nombres y Apellidos */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">
                      Nombres y Apellidos Completos *
                    </label>
                    <input
                      type="text"
                      required
                      value={apprenticeForm.name}
                      onChange={(e) => setApprenticeForm({ ...apprenticeForm, name: e.target.value })}
                      placeholder="Ej. María Fernanda Maldonado Cortés"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  {/* Documento */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">
                        Tipo Doc.
                      </label>
                      <select
                        value={apprenticeForm.docType}
                        onChange={(e) =>
                          setApprenticeForm({ ...apprenticeForm, docType: e.target.value as DocType })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        <option value="CC">CC - Cédula</option>
                        <option value="TI">TI - Tarjeta</option>
                        <option value="CE">CE - Extranjería</option>
                        <option value="PEP">PEP</option>
                        <option value="PPT">PPT</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        required
                        value={apprenticeForm.docNumber}
                        onChange={(e) => setApprenticeForm({ ...apprenticeForm, docNumber: e.target.value })}
                        placeholder="Ej. 1024567890"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Ficha y Programa */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">
                        Número de Ficha *
                      </label>
                      <input
                        type="text"
                        required
                        value={apprenticeForm.fichaNumber}
                        onChange={(e) =>
                          setApprenticeForm({ ...apprenticeForm, fichaNumber: e.target.value })
                        }
                        placeholder="2874921"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700 dark:text-emerald-400"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">
                        Programa de Formación
                      </label>
                      <select
                        value={apprenticeForm.program}
                        onChange={(e) => setApprenticeForm({ ...apprenticeForm, program: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        {SENA_PROGRAMS.map((prog) => (
                          <option key={prog} value={prog}>
                            {prog}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Regional y Centro */}
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1">
                      Regional y Centro de Formación
                    </label>
                    <select
                      onChange={handleRegionalSelect}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      {SENA_REGIONALES.map((item, idx) => (
                        <option key={idx} value={idx}>
                          {item.regional} — {item.center}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#39A900] hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer"
                    >
                      <span>Iniciar mi Inducción SENA</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* INSTRUCTOR PASSWORD FORM (Requires Sena1234) */
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Lock className="w-5 h-5 text-amber-500" />
                      <span>Validación de Clave de Instructor</span>
                    </h3>
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full uppercase">
                      Clave Requerida
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Para acceder al panel de control, seguimiento y sincronización con Google Drive, ingresa la clave de instructor.
                  </p>
                </div>

                {passwordError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <form onSubmit={handleInstructorSubmit} className="space-y-5 text-xs">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider mb-1.5">
                      Clave de Instructor (Sena1234) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={instructorPassword}
                        onChange={(e) => {
                          setInstructorPassword(e.target.value);
                          if (passwordError) setPasswordError(null);
                        }}
                        placeholder="Ingresa la clave Sena1234"
                        className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 block">
                      Pista institucional: La clave de acceso establecida es <strong>Sena1234</strong>
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 space-y-2 text-xs">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Al ingresar tendrás acceso a:</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <li>Conectar y sincronizar tu cuenta de Google Drive / Sheets.</li>
                      <li>Consultar el consolidado de aprendices y calificaciones de la ficha.</li>
                      <li>Copiar el enlace para enviar a los aprendices sin clave.</li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#00324D] hover:bg-slate-800 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer"
                    >
                      <span>Ingresar al Panel de Instructor</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400 text-center transition-colors">
        <p>Servicio Nacional de Aprendizaje SENA — Dirección General • República de Colombia</p>
      </footer>
    </div>
  );
};
