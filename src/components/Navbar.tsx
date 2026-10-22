import React from 'react';
import { SenaLogo } from './SenaLogo';
import { ApprenticeProfile, Badge } from '../types/induction';
import {
  Award,
  BookOpen,
  Sparkles,
  User,
  Zap,
  BrainCircuit,
  MessageSquareText,
  FileCheck2,
  FileSpreadsheet,
  Moon,
  Sun,
  Type,
  GraduationCap,
  Share2,
  Check,
  LogOut
} from 'lucide-react';

export type UserRole = 'aprendiz' | 'instructor';

interface NavbarProps {
  profile: ApprenticeProfile;
  activeTab: 'modules' | 'classifier' | 'cases' | 'exam' | 'certificate' | 'instructor';
  setActiveTab: (tab: 'modules' | 'classifier' | 'cases' | 'exam' | 'certificate' | 'instructor') => void;
  xp: number;
  badges: Badge[];
  userRole: UserRole;
  onToggleUserRole: () => void;
  onCopyApprenticeLink?: () => void;
  onExitToLanding?: () => void;
  onOpenProfile: () => void;
  onOpenBadges: () => void;
  onOpenAIModal: () => void;
  onOpenRoster?: () => void;
  rosterCount?: number;
  isCertified: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  fontScale: 'normal' | 'large' | 'xlarge';
  onToggleFontScale: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeTab,
  setActiveTab,
  xp,
  badges,
  userRole,
  onToggleUserRole,
  onCopyApprenticeLink,
  onExitToLanding,
  onOpenProfile,
  onOpenBadges,
  onOpenAIModal,
  onOpenRoster,
  rosterCount,
  isCertified,
  darkMode,
  onToggleDarkMode,
  fontScale,
  onToggleFontScale
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const unlockedBadgesCount = badges.filter((b) => b.unlocked).length;

  // Calculate Level based on XP
  const getLevelInfo = (currentXp: number) => {
    if (currentXp < 200) return { level: 1, title: 'Aspirante SENA', nextThreshold: 200 };
    if (currentXp < 500) return { level: 2, title: 'Aprendiz Novato', nextThreshold: 500 };
    if (currentXp < 900) return { level: 3, title: 'Aprendiz Comprometido', nextThreshold: 900 };
    if (currentXp < 1400) return { level: 4, title: 'Líder de Convivencia', nextThreshold: 1400 };
    return { level: 5, title: 'Maestro del Reglamento', nextThreshold: 2000 };
  };

  const levelInfo = getLevelInfo(xp);

  const getFontLabel = () => {
    if (fontScale === 'xlarge') return 'Letra: Muy Grande';
    if (fontScale === 'large') return 'Letra: Grande';
    return 'Letra: Normal';
  };

  const handleCopyLinkWithFeedback = () => {
    if (onCopyApprenticeLink) {
      onCopyApprenticeLink();
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors duration-300 no-print w-full max-w-full">
      {/* 1. Franja Superior Institucional (Accesos de Rol, Utilidades y Sistema - 100% Visibles) */}
      <div className="bg-[#00324D] dark:bg-slate-950 text-white py-2 px-3 sm:px-6 lg:px-8 border-b border-emerald-900/40 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Identidad Institucional y Ficha */}
          <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#39A900] animate-pulse shrink-0"></span>
            <span className="font-extrabold tracking-wide text-emerald-400 shrink-0">SENA Colombia</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200 font-medium text-xs sm:text-sm">
              Inducción Integral y Reglamento (Acuerdo 009 de 2024)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
              Ficha: {profile.fichaNumber || '2874921'}
            </span>
          </div>

          {/* Botones de Gestión y Utilidades - 100% Visibles */}
          <div className="flex items-center flex-wrap gap-2 ml-auto">
            {/* Control de Rol (Instructor o Aprendiz) */}
            {userRole === 'instructor' ? (
              <div className="flex items-center flex-wrap gap-1.5 bg-emerald-950/60 p-1 rounded-xl border border-emerald-500/30">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 px-2 py-1">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Modo Instructor</span>
                </span>
                {onCopyApprenticeLink && (
                  <button
                    onClick={handleCopyLinkWithFeedback}
                    title="Copiar enlace para compartir con los aprendices"
                    className="inline-flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-white/20"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span className="text-emerald-300">¡Enlace Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copiar Enlace Aprendices</span>
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={onToggleUserRole}
                  title="Cambiar a Vista Aprendiz"
                  className="inline-flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Vista Aprendiz</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center flex-wrap gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 px-2 py-1">
                  <span>🎓 Modo Aprendiz</span>
                </span>
                <button
                  onClick={onToggleUserRole}
                  title="Acceso al Panel de Control del Instructor con clave institucional"
                  className="inline-flex items-center gap-1.5 text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Acceso Instructor</span>
                </button>
              </div>
            )}

            {/* Botón Asistente Virtual Tutor SofIA */}
            <button
              onClick={onOpenAIModal}
              title="Abrir Asistente Tutor SofIA"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#39A900] hover:bg-[#329600] text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Tutor SofIA</span>
            </button>

            {/* Botón Accesibilidad: Tamaño de Letra */}
            <button
              onClick={onToggleFontScale}
              title="Ajustar tamaño de texto (Normal, Grande, Muy Grande)"
              aria-label="Ajustar tamaño de letra"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer border border-slate-700"
            >
              <Type className="w-3.5 h-3.5 text-emerald-400" />
              <span>{getFontLabel()}</span>
            </button>

            {/* Botón Modo Claro / Oscuro */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
              aria-label="Alternar modo oscuro"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer border border-slate-700"
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Modo Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span>Modo Oscuro</span>
                </>
              )}
            </button>

            {/* Botón Salir / Cambiar Rol */}
            {onExitToLanding && (
              <button
                onClick={onExitToLanding}
                title="Cerrar sesión y volver a la selección de rol"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-950/90 hover:bg-rose-900 text-rose-200 hover:text-white px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer border border-rose-800/80"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Salir / Cambiar Rol</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Barra Principal (Identidad del Programa + Gamificación + Avatar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo y Nombre del Programa de Formación */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab(userRole === 'instructor' ? 'instructor' : 'modules')}
          >
            <SenaLogo showText={true} className="w-12 h-12 transition-transform group-hover:scale-105" variant="green" />
            <div className="pl-3 border-l-2 border-slate-200 dark:border-slate-800">
              <span className="block text-[11px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400">
                {userRole === 'instructor' ? 'Panel de Inducción SENA (Instructor)' : 'Plataforma de Inducción Integral'}
              </span>
              <p className="text-sm sm:text-base font-extrabold text-[#00324D] dark:text-slate-100 line-clamp-1">
                {profile.program || 'ADSO - Análisis y Desarrollo de Software'}
              </p>
            </div>
          </div>

          {/* Estadísticas de Gamificación y Perfil */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Contador de XP */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-amber-900 dark:text-amber-300 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <div className="text-right leading-none">
                <span className="text-sm font-black tracking-tight">{xp}</span>
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 ml-1">XP</span>
              </div>
            </div>

            {/* Contador de Medallas */}
            <button
              onClick={onOpenBadges}
              title="Ver medallas e insignias obtenidas"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-extrabold text-slate-800 dark:text-white">{unlockedBadgesCount}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/{badges.length} Medallas</span>
            </button>

            {/* Perfil del Aprendiz */}
            <button
              onClick={onOpenProfile}
              title="Configurar mis datos de caracterización de aprendiz"
              className="inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer bg-white dark:bg-slate-900"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left leading-tight">
                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 block max-w-[130px] truncate">
                  {profile.name.split(' ')[0] || 'Aprendiz'}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 block">
                  {levelInfo.title}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Menú de Navegación de la Barra Superior (BOTONES DEL MENÚ 100% VISIBLES EN TODO MOMENTO) */}
      <div className="bg-slate-50/90 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto">
          <nav
            aria-label="Menú principal de inducción"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth"
          >
            {/* Botón Panel Instructor (si el rol activo es Instructor) */}
            {userRole === 'instructor' && (
              <button
                onClick={() => setActiveTab('instructor')}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeTab === 'instructor'
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/40'
                    : 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-white shrink-0" />
                <span>Panel Instructor</span>
                {typeof rosterCount === 'number' && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      activeTab === 'instructor'
                        ? 'bg-emerald-800 text-white'
                        : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                    }`}
                  >
                    {rosterCount}
                  </span>
                )}
              </button>
            )}

            {/* 1. Botón Ruta Formativa */}
            <button
              onClick={() => setActiveTab('modules')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'modules'
                  ? 'bg-[#00324D] dark:bg-emerald-950 text-white shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
              }`}
            >
              <BookOpen
                className={`w-4 h-4 shrink-0 ${
                  activeTab === 'modules' ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'
                }`}
              />
              <span>Ruta Formativa</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  activeTab === 'modules'
                    ? 'bg-white/20 text-emerald-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                5 Módulos
              </span>
            </button>

            {/* 2. Botón Clasificador de Faltas */}
            <button
              onClick={() => setActiveTab('classifier')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'classifier'
                  ? 'bg-[#00324D] dark:bg-emerald-950 text-white shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
              }`}
            >
              <Zap
                className={`w-4 h-4 shrink-0 ${
                  activeTab === 'classifier' ? 'text-amber-300' : 'text-amber-500'
                }`}
              />
              <span>Clasificador</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  activeTab === 'classifier'
                    ? 'bg-white/20 text-amber-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                Juego
              </span>
            </button>

            {/* 3. Botón Dilemas Éticos */}
            <button
              onClick={() => setActiveTab('cases')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'cases'
                  ? 'bg-[#00324D] dark:bg-emerald-950 text-white shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
              }`}
            >
              <BrainCircuit
                className={`w-4 h-4 shrink-0 ${
                  activeTab === 'cases' ? 'text-cyan-300' : 'text-cyan-600 dark:text-cyan-400'
                }`}
              />
              <span>Dilemas Éticos</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  activeTab === 'cases'
                    ? 'bg-white/20 text-cyan-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                Casos Reales
              </span>
            </button>

            {/* 4. Botón Evaluación Final */}
            <button
              onClick={() => setActiveTab('exam')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'exam'
                  ? 'bg-[#00324D] dark:bg-emerald-950 text-white shadow-md ring-2 ring-emerald-500/50'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
              }`}
            >
              <FileCheck2
                className={`w-4 h-4 shrink-0 ${
                  activeTab === 'exam' ? 'text-purple-300' : 'text-purple-600 dark:text-purple-400'
                }`}
              />
              <span>Evaluación Final</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  activeTab === 'exam'
                    ? 'bg-white/20 text-purple-200'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                Certificación
              </span>
            </button>

            {/* 5. Botón Certificado Oficial */}
            <button
              onClick={() => setActiveTab('certificate')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 relative ${
                activeTab === 'certificate'
                  ? 'bg-[#39A900] text-white shadow-md ring-2 ring-emerald-500/60'
                  : isCertified
                  ? 'bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
              }`}
            >
              <Award
                className={`w-4 h-4 shrink-0 ${
                  isCertified ? 'text-amber-500 animate-pulse' : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>Certificado Oficial</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                  activeTab === 'certificate'
                    ? 'bg-white/20 text-white'
                    : isCertified
                    ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {isCertified ? '✓ Disponible' : 'Bloqueado'}
              </span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
