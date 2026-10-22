/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ApprenticeProfile,
  InductionModule,
  Badge,
  ApprenticeRecord,
  TimelineMilestone
} from './types/induction';
import {
  INDUCTION_MODULES,
  BADGES_DATA,
  INITIAL_STORAGE_KEY
} from './data/senaRegulationData';
import { Navbar, UserRole } from './components/Navbar';
import { ModuleViewer } from './components/ModuleViewer';
import { ClassificationGame } from './components/ClassificationGame';
import { CaseSimulator } from './components/CaseSimulator';
import { FinalExam } from './components/FinalExam';
import { CertificateView } from './components/CertificateView';
import { ProfileModal } from './components/ProfileModal';
import { BadgesModal } from './components/BadgesModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { ApprenticeRosterModal } from './components/ApprenticeRosterModal';
import { InstructorDashboard } from './components/InstructorDashboard';
import { LandingPage } from './components/LandingPage';
import { queueSilentApprenticeSync } from './services/googleSheetsService';
import {
  Award,
  BookOpen,
  Sparkles,
  Zap,
  BrainCircuit,
  FileCheck2,
  ListOrdered,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Moon,
  Sun
} from 'lucide-react';

const DEFAULT_PROFILE: ApprenticeProfile = {
  name: 'María Fernanda Maldonado Cortés',
  docType: 'CC',
  docNumber: '1024567890',
  program: 'ADSO - Análisis y Desarrollo de Software',
  fichaNumber: '2874921',
  regional: 'Distrito Capital',
  center: 'Centro de Tecnologías del Transporte - Regional D.C.',
  avatar: 'female-1',
  registeredAt: new Date().toISOString()
};

const INITIAL_ROSTER_SAMPLE: ApprenticeRecord[] = [
  {
    id: 'apr-1024567890',
    name: 'María Fernanda Maldonado Cortés',
    docType: 'CC',
    docNumber: '1024567890',
    program: 'ADSO - Análisis y Desarrollo de Software',
    fichaNumber: '2874921',
    regional: 'Distrito Capital',
    center: 'Centro de Tecnologías del Transporte - Regional D.C.',
    status: 'Certificado',
    scorePercentage: 90,
    xp: 650,
    badgesEarned: 5,
    verificationCode: 'SENA-IND-2024-7890-2874921',
    registeredAt: '2024-02-15T08:30:00.000Z',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'apr-1019283746',
    name: 'Andrés Felipe Gómez Restrepo',
    docType: 'CC',
    docNumber: '1019283746',
    program: 'ADSO - Análisis y Desarrollo de Software',
    fichaNumber: '2874921',
    regional: 'Distrito Capital',
    center: 'Centro de Tecnologías del Transporte - Regional D.C.',
    status: 'Certificado',
    scorePercentage: 85,
    xp: 520,
    badgesEarned: 4,
    verificationCode: 'SENA-IND-2024-3746-2874921',
    registeredAt: '2024-02-15T09:15:00.000Z',
    updatedAt: '2024-02-16T14:20:00.000Z'
  },
  {
    id: 'apr-1098765432',
    name: 'Valentina Rodríguez Martínez',
    docType: 'TI',
    docNumber: '1098765432',
    program: 'ADSO - Análisis y Desarrollo de Software',
    fichaNumber: '2874921',
    regional: 'Distrito Capital',
    center: 'Centro de Tecnologías del Transporte - Regional D.C.',
    status: 'En Proceso',
    scorePercentage: 0,
    xp: 210,
    badgesEarned: 2,
    registeredAt: '2024-02-16T10:00:00.000Z',
    updatedAt: '2024-02-16T11:45:00.000Z'
  }
];

const buildInitialMilestones = (
  currentProfile: ApprenticeProfile,
  currentModules: InductionModule[],
  currentBadges: Badge[],
  currentCertified: boolean,
  currentScore: number
): TimelineMilestone[] => {
  const list: TimelineMilestone[] = [];
  const baseDate = new Date(currentProfile.registeredAt || '2024-02-15T08:30:00.000Z');

  // 1. Initial characterization
  list.push({
    id: 'mile-reg',
    category: 'registro',
    title: 'Registro e Inicio de Inducción SENA',
    description: `Ficha de caracterización asignada (${currentProfile.fichaNumber || '2874921'}) para el programa ${currentProfile.program}.`,
    timestamp: baseDate.toISOString(),
    xpEarned: 50,
    status: 'completado'
  });

  // 2. Completed modules
  currentModules.forEach((m, idx) => {
    if (m.completed) {
      const moduleDate = new Date(baseDate.getTime() + (idx + 1) * 3600 * 1000 * 2);
      list.push({
        id: `mile-${m.id}`,
        category: 'modulo',
        title: `Módulo ${m.number} Completado: ${m.shortTitle}`,
        description: `Finalizó satisfactoriamente la lectura y estudio del Módulo ${m.number}: "${m.title}".`,
        timestamp: moduleDate.toISOString(),
        xpEarned: m.pointsReward,
        moduleNumber: m.number,
        status: 'completado'
      });
    }
  });

  // 3. Unlocked badges
  currentBadges.forEach((b, idx) => {
    if (b.unlocked) {
      const badgeDate = b.unlockedAt
        ? new Date(b.unlockedAt)
        : new Date(baseDate.getTime() + (idx + 1) * 3600 * 1000 * 2.5);
      list.push({
        id: `mile-${b.id}`,
        category: 'medalla',
        title: `Medalla Ganada: ${b.title}`,
        description: b.description,
        timestamp: badgeDate.toISOString(),
        badgeId: b.id,
        badgeTitle: b.title,
        xpEarned: 50,
        status: 'completado'
      });
    }
  });

  // 4. Final evaluation if completed
  if (currentScore > 0 || currentCertified) {
    const examDate = new Date(baseDate.getTime() + 24 * 3600 * 1000);
    list.push({
      id: 'mile-exam',
      category: 'evaluacion',
      title: `Evaluación Final Aprobada con ${currentScore || 90}%`,
      description: `Aprobó satisfactoriamente el examen integral del Reglamento del Aprendiz (Acuerdo 009 de 2024).`,
      timestamp: examDate.toISOString(),
      score: currentScore || 90,
      xpEarned: 250,
      status: 'completado'
    });
  }

  // 5. Official certificate
  if (currentCertified) {
    const certDate = new Date(baseDate.getTime() + 24 * 3600 * 1000 + 15 * 60 * 1000);
    list.push({
      id: 'mile-cert',
      category: 'certificado',
      title: 'Certificación Oficial de Inducción Emitida',
      description: `Certificado oficial validado con código QR institucional para la ficha ${currentProfile.fichaNumber || '2874921'}.`,
      timestamp: certDate.toISOString(),
      xpEarned: 100,
      status: 'completado'
    });
  }

  // Sort descending by default (newest first)
  return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export default function App() {
  // Theme state: dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem(`${INITIAL_STORAGE_KEY}_theme`);
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // State to trigger the screen blur effect
  const [isScreenBlurActive, setIsScreenBlurActive] = useState<boolean>(false);

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(`${INITIAL_STORAGE_KEY}_theme`, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(`${INITIAL_STORAGE_KEY}_theme`, 'light');
    }
  }, [darkMode]);

  // Font scaling state: normal, large, xlarge
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_font_scale`);
    return (saved as 'normal' | 'large' | 'xlarge') || 'normal';
  });

  useEffect(() => {
    document.documentElement.classList.remove('font-scale-large', 'font-scale-xlarge');
    if (fontScale === 'large') {
      document.documentElement.classList.add('font-scale-large');
    } else if (fontScale === 'xlarge') {
      document.documentElement.classList.add('font-scale-xlarge');
    }
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_font_scale`, fontScale);
  }, [fontScale]);

  const handleToggleFontScale = () => {
    setFontScale((prev) => {
      const next = prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal';
      triggerToast(
        next === 'xlarge'
          ? 'Tamaño de letra: Muy Grande'
          : next === 'large'
          ? 'Tamaño de letra: Grande'
          : 'Tamaño de letra: Normal',
        'theme'
      );
      return next;
    });
  };

  const handleToggleDarkMode = () => {
    // Trigger screen blur effect
    setIsScreenBlurActive(true);
    setTimeout(() => {
      setIsScreenBlurActive(false);
    }, 850);

    setDarkMode((prev) => !prev);
  };

  // Local storage state initialization
  const [profile, setProfile] = useState<ApprenticeProfile>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [modules, setModules] = useState<InductionModule[]>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_modules`);
    return saved ? JSON.parse(saved) : INDUCTION_MODULES;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_badges`);
    return saved ? JSON.parse(saved) : BADGES_DATA;
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_xp`);
    return saved ? parseInt(saved, 10) : 100;
  });

  const [isCertified, setIsCertified] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_certified`);
    return saved === 'true';
  });

  const [scorePercentage, setScorePercentage] = useState<number>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_score`);
    return saved ? parseInt(saved, 10) : 90;
  });

  const [milestones, setMilestones] = useState<TimelineMilestone[]>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_milestones`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    const savedProfile = localStorage.getItem(`${INITIAL_STORAGE_KEY}_profile`);
    const initialProf = savedProfile ? JSON.parse(savedProfile) : DEFAULT_PROFILE;
    const savedMods = localStorage.getItem(`${INITIAL_STORAGE_KEY}_modules`);
    const initialMods = savedMods ? JSON.parse(savedMods) : INDUCTION_MODULES;
    const savedBadges = localStorage.getItem(`${INITIAL_STORAGE_KEY}_badges`);
    const initialBadges = savedBadges ? JSON.parse(savedBadges) : BADGES_DATA;
    const savedCert = localStorage.getItem(`${INITIAL_STORAGE_KEY}_certified`) === 'true';
    const savedScore = parseInt(localStorage.getItem(`${INITIAL_STORAGE_KEY}_score`) || '90', 10);
    return buildInitialMilestones(initialProf, initialMods, initialBadges, savedCert, savedScore);
  });

  // User Role State: 'aprendiz' vs 'instructor'
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      if (roleParam === 'instructor' || roleParam === 'aprendiz') {
        return roleParam;
      }
      const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_user_role`);
      if (saved === 'instructor' || saved === 'aprendiz') {
        return saved;
      }
    }
    return 'aprendiz'; // Default role is apprentice so shared links land directly in induction
  });

  // Sync role to localStorage and URL search param
  useEffect(() => {
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_user_role`, userRole);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('role', userRole);
      window.history.replaceState(null, '', url.toString());
    }
  }, [userRole]);

  const [activeTab, setActiveTab] = useState<
    'modules' | 'classifier' | 'cases' | 'exam' | 'certificate' | 'instructor'
  >(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('role') === 'instructor') return 'instructor';
      const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_user_role`);
      if (saved === 'instructor') return 'instructor';
    }
    return 'modules';
  });

  // Controls whether the landing page for role selection is shown
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hasActiveSession = localStorage.getItem(`${INITIAL_STORAGE_KEY}_session_active`);
      if (hasActiveSession === 'true') {
        return false;
      }
    }
    return true; // Default to landing page on initial load so roles never get mixed up
  });

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [showPlanBanner, setShowPlanBanner] = useState(true);

  // Apprentice Roster (structured sheet data for all learners)
  const [roster, setRoster] = useState<ApprenticeRecord[]>(() => {
    const saved = localStorage.getItem(`${INITIAL_STORAGE_KEY}_roster`);
    return saved ? JSON.parse(saved) : INITIAL_ROSTER_SAMPLE;
  });

  // Notification Toast
  const [toastNotice, setToastNotice] = useState<{ message: string; type: 'xp' | 'badge' | 'theme' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_roster`, JSON.stringify(roster));
  }, [roster]);

  // Keep active apprentice synchronized into the roster record and silently push to Google Sheets
  useEffect(() => {
    const cleanDoc = profile.docNumber.replace(/\D/g, '') || '0000';
    const updatedRecord: ApprenticeRecord = {
      id: `apr-${profile.docNumber}`,
      name: profile.name,
      docType: profile.docType,
      docNumber: profile.docNumber,
      program: profile.program,
      fichaNumber: profile.fichaNumber,
      regional: profile.regional,
      center: profile.center,
      status: isCertified ? 'Certificado' : 'En Proceso',
      scorePercentage: scorePercentage,
      xp: xp,
      badgesEarned: badges.filter((b) => b.unlocked).length,
      verificationCode: isCertified
        ? `SENA-IND-2024-${cleanDoc.slice(-4)}-${profile.fichaNumber || '2874'}`
        : undefined,
      registeredAt: profile.registeredAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRoster((prev) => {
      const existingIdx = prev.findIndex((r) => r.docNumber === profile.docNumber);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = updatedRecord;
        return copy;
      }
      return [updatedRecord, ...prev];
    });

    // Silently queue the active record to Google Sheets in the background on every apprentice milestone
    queueSilentApprenticeSync(updatedRecord);
  }, [
    profile.name,
    profile.docType,
    profile.docNumber,
    profile.fichaNumber,
    profile.program,
    profile.regional,
    profile.center,
    isCertified,
    scorePercentage,
    xp,
    badges
  ]);

  useEffect(() => {
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_modules`, JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_badges`, JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_xp`, xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_certified`, isCertified.toString());
  }, [isCertified]);

  useEffect(() => {
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_score`, scorePercentage.toString());
  }, [scorePercentage]);

  const triggerToast = (message: string, type: 'xp' | 'badge' | 'theme') => {
    setToastNotice({ message, type });
    setTimeout(() => setToastNotice(null), 3500);
  };

  const handleEarnXp = (amount: number, reason: string) => {
    setXp((prev) => prev + amount);
    triggerToast(`+${amount} XP: ${reason}`, 'xp');
  };

  const handleUnlockBadge = (badgeId: string) => {
    setBadges((prev) =>
      prev.map((b) => {
        if (b.id === badgeId && !b.unlocked) {
          triggerToast(`¡Medalla Desbloqueada: ${b.title}!`, 'badge');
          return { ...b, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return b;
      })
    );
  };

  const handleCompleteModule = (moduleId: string, points: number) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, completed: true } : m))
    );
    handleEarnXp(points, 'Módulo completado');

    // Unlock corresponding badge
    if (moduleId === 'mod-1') handleUnlockBadge('badge-identidad');
    if (moduleId === 'mod-2') handleUnlockBadge('badge-derechos');
    if (moduleId === 'mod-3') handleUnlockBadge('badge-deberes');
    if (moduleId === 'mod-4') handleUnlockBadge('badge-convivencia');
    if (moduleId === 'mod-5') handleUnlockBadge('badge-debido-proceso');
  };

  const handlePassExam = (score: number) => {
    setScorePercentage(score);
    setIsCertified(true);
    handleUnlockBadge('badge-certificado');
    triggerToast(`¡Certificación SENA Aprobada con ${score}%!`, 'badge');
  };

  const handleResetProgress = () => {
    if (confirm('¿Deseas reiniciar el progreso de la inducción para una nueva prueba?')) {
      localStorage.clear();
      setModules(INDUCTION_MODULES);
      setBadges(BADGES_DATA);
      setXp(50);
      setIsCertified(false);
      setScorePercentage(0);
      setActiveTab('modules');
      triggerToast('Progreso reiniciado correctamente', 'xp');
    }
  };

  const handleSelectActiveProfile = (record: ApprenticeRecord) => {
    setProfile({
      name: record.name,
      docType: record.docType,
      docNumber: record.docNumber,
      program: record.program,
      fichaNumber: record.fichaNumber,
      regional: record.regional,
      center: record.center,
      avatar: 'female-1',
      registeredAt: record.registeredAt
    });
    setIsCertified(record.status === 'Certificado');
    setScorePercentage(record.scorePercentage || 0);
    setXp(record.xp || 50);
    triggerToast(`Aprendiz activo: ${record.name}`, 'xp');
  };

  const handleAddOrUpdateRecord = (record: ApprenticeRecord) => {
    setRoster((prev) => {
      const exists = prev.findIndex((r) => r.id === record.id || r.docNumber === record.docNumber);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = record;
        return updated;
      }
      return [record, ...prev];
    });
    queueSilentApprenticeSync(record);
    triggerToast('Registro de aprendiz guardado en la hoja', 'xp');
  };

  const handleDeleteRecord = (id: string) => {
    setRoster((prev) => prev.filter((r) => r.id !== id));
    triggerToast('Registro eliminado de la hoja', 'xp');
  };

  const handleToggleUserRole = () => {
    setUserRole((prev) => {
      const next: UserRole = prev === 'aprendiz' ? 'instructor' : 'aprendiz';
      if (next === 'instructor') {
        setActiveTab('instructor');
        triggerToast('Modo Instructor activado con privilegios de gestión', 'theme');
      } else {
        if (activeTab === 'instructor') setActiveTab('modules');
        triggerToast('Modo Aprendiz activado. Vista de inducción', 'theme');
      }
      return next;
    });
  };

  const handleCopyApprenticeLink = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('role', 'aprendiz');
      navigator.clipboard.writeText(url.toString()).then(() => {
        triggerToast('¡Enlace de aprendices copiado! Compártelo con la ficha', 'xp');
      });
    }
  };

  const handleEnterAsApprentice = (characterization: ApprenticeProfile) => {
    setProfile(characterization);
    setUserRole('aprendiz');
    setActiveTab('modules');
    setShowLanding(false);
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_session_active`, 'true');

    // Build and save initial record for apprentice
    const cleanDoc = characterization.docNumber.replace(/\D/g, '') || '0000';
    const newRecord: ApprenticeRecord = {
      id: `apr-${characterization.docNumber}`,
      name: characterization.name,
      docType: characterization.docType,
      docNumber: characterization.docNumber,
      program: characterization.program,
      fichaNumber: characterization.fichaNumber,
      regional: characterization.regional,
      center: characterization.center,
      status: 'En Proceso',
      scorePercentage: 0,
      xp: xp,
      badgesEarned: badges.filter((b) => b.unlocked).length,
      verificationCode: isCertified
        ? `SENA-IND-2024-${cleanDoc.slice(-4)}-${characterization.fichaNumber || '2874'}`
        : undefined,
      registeredAt: characterization.registeredAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    handleAddOrUpdateRecord(newRecord);

    triggerToast(`¡Bienvenido(a) ${characterization.name.split(' ')[0]}! Ruta de inducción iniciada`, 'xp');
  };

  const handleEnterAsInstructor = () => {
    setUserRole('instructor');
    setActiveTab('instructor');
    setShowLanding(false);
    localStorage.setItem(`${INITIAL_STORAGE_KEY}_session_active`, 'true');
    triggerToast('Acceso concedido al Panel del Instructor. Clave verificada', 'theme');
  };

  const handleExitToLanding = () => {
    setShowLanding(true);
    localStorage.removeItem(`${INITIAL_STORAGE_KEY}_session_active`);
    triggerToast('Has cerrado sesión. Selecciona tu rol de ingreso.', 'theme');
  };

  if (showLanding) {
    return (
      <div className="relative w-full max-w-full overflow-x-hidden">
        {/* Screen Blur Overlay Effect when Dark Mode is toggled */}
        {isScreenBlurActive && (
          <div
            className="fixed inset-0 z-50 pointer-events-none screen-blur-active flex items-center justify-center bg-slate-900/10 dark:bg-emerald-950/20"
            aria-hidden="true"
          >
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl px-6 py-3 rounded-full shadow-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
              {darkMode ? (
                <>
                  <Moon className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  <span>Modo Oscuro Aplicado</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Modo Claro Aplicado</span>
                </>
              )}
            </div>
          </div>
        )}

        <LandingPage
          initialProfile={profile}
          onEnterAsApprentice={handleEnterAsApprentice}
          onEnterAsInstructor={handleEnterAsInstructor}
          darkMode={darkMode}
          onToggleDarkMode={handleToggleDarkMode}
          fontScale={fontScale}
          onToggleFontScale={handleToggleFontScale}
        />

        {/* Floating Gamification Toast Notice */}
        {toastNotice && (
          <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div
              className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 ${
                toastNotice.type === 'badge'
                  ? 'bg-amber-500 text-white border-amber-400'
                  : 'bg-[#00324D] dark:bg-slate-900 text-white border-slate-700 dark:border-slate-800'
              }`}
            >
              {toastNotice.type === 'badge' ? (
                <Award className="w-5 h-5 text-white animate-bounce" />
              ) : (
                <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              )}
              <span className="text-xs font-bold">{toastNotice.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-300 relative w-full max-w-full overflow-x-hidden">
      {/* Screen Blur Overlay Effect when Dark Mode is toggled */}
      {isScreenBlurActive && (
        <div
          className="fixed inset-0 z-50 pointer-events-none screen-blur-active flex items-center justify-center bg-slate-900/10 dark:bg-emerald-950/20"
          aria-hidden="true"
        >
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl px-6 py-3 rounded-full shadow-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-2.5 animate-in fade-in zoom-in-95 duration-200 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
            {darkMode ? (
              <>
                <Moon className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>Modo Oscuro Aplicado</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Modo Claro Aplicado</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navbar with stats, tabs, Roster Sheet and Dark Mode Toggle in Top Right */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        xp={xp}
        badges={badges}
        userRole={userRole}
        onToggleUserRole={handleToggleUserRole}
        onCopyApprenticeLink={handleCopyApprenticeLink}
        onExitToLanding={handleExitToLanding}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenRoster={userRole === 'instructor' ? () => setIsRosterModalOpen(true) : undefined}
        rosterCount={roster.length}
        isCertified={isCertified}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        fontScale={fontScale}
        onToggleFontScale={handleToggleFontScale}
      />

      {/* Structured Plan Banner for Induction (can be dismissed) */}
      {showPlanBanner && (
        <aside aria-label="Plan de inducción SENA" className="no-print bg-[#00324D] dark:bg-slate-900 text-white border-b border-emerald-900/40 dark:border-slate-800 px-4 py-3 sm:px-8 transition-colors w-full max-w-full overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 w-full max-w-full">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#39A900] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <ListOrdered className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block truncate">
                  {userRole === 'instructor' ? 'Panel de Inducción SENA (Modo Instructor)' : 'Plan Estructurado de Inducción SENA 2024'}
                </span>
                <p className="text-xs text-slate-200 dark:text-slate-300 mt-0.5 break-words">
                  {userRole === 'instructor'
                    ? 'Supervisa en tiempo real el progreso de los aprendices, administra la sincronización con Google Drive y genera el enlace de acceso.'
                    : '1. Ruta de 5 Módulos (Acuerdo 009 de 2024) ➔ 2. Desafío Clasificador ➔ 3. Dilemas Éticos ➔ 4. Evaluación Final ➔ 5. Certificado Oficial con QR.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
              {userRole === 'instructor' ? (
                <>
                  <button
                    onClick={handleCopyApprenticeLink}
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Copiar Enlace para Aprendices
                  </button>
                  <button
                    onClick={() => setActiveTab('instructor')}
                    className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0"
                  >
                    Ver Panel de Control
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="text-xs bg-white/10 hover:bg-white/20 dark:bg-slate-800 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer shrink-0"
                >
                  Personalizar mi Ficha
                </button>
              )}
              <button
                onClick={() => setShowPlanBanner(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1.5 cursor-pointer shrink-0"
              >
                Ocultar
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Floating Gamification Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-3 ${
              toastNotice.type === 'badge'
                ? 'bg-amber-500 text-white border-amber-400'
                : 'bg-[#00324D] dark:bg-slate-900 text-white border-slate-700 dark:border-slate-800'
            }`}
          >
            {toastNotice.type === 'badge' ? (
              <Award className="w-5 h-5 text-white animate-bounce" />
            ) : (
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            )}
            <span className="text-xs font-bold">{toastNotice.message}</span>
          </div>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
        {activeTab === 'instructor' && userRole === 'instructor' && (
          <InstructorDashboard
            roster={roster}
            activeProfile={profile}
            onSelectActiveProfile={handleSelectActiveProfile}
            onAddOrUpdateRecord={handleAddOrUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onSwitchToApprenticeView={() => {
              setUserRole('aprendiz');
              setActiveTab('modules');
              triggerToast('Cambiado a Vista Aprendiz', 'theme');
            }}
            onExitToLanding={handleExitToLanding}
            onTriggerToast={triggerToast}
          />
        )}

        {activeTab === 'modules' && (
          <ModuleViewer
            modules={modules}
            onCompleteModule={handleCompleteModule}
            onNavigateToClassifier={() => setActiveTab('classifier')}
            onNavigateToCases={() => setActiveTab('cases')}
            onNavigateToExam={() => setActiveTab('exam')}
          />
        )}

        {activeTab === 'classifier' && (
          <ClassificationGame
            onEarnXp={handleEarnXp}
            onUnlockBadge={handleUnlockBadge}
            onNavigateToCases={() => setActiveTab('cases')}
          />
        )}

        {activeTab === 'cases' && (
          <CaseSimulator
            onEarnXp={handleEarnXp}
            onUnlockBadge={handleUnlockBadge}
            onNavigateToExam={() => setActiveTab('exam')}
          />
        )}

        {activeTab === 'exam' && (
          <FinalExam
            onPassExam={handlePassExam}
            onEarnXp={handleEarnXp}
            onNavigateToCertificate={() => setActiveTab('certificate')}
            isAlreadyCertified={isCertified}
          />
        )}

        {activeTab === 'certificate' && (
          <CertificateView
            profile={profile}
            scorePercentage={scorePercentage}
            isCertified={isCertified}
            onNavigateToExam={() => setActiveTab('exam')}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenRoster={userRole === 'instructor' ? () => setIsRosterModalOpen(true) : undefined}
          />
        )}
      </main>

      {/* Institutional Footer (Hidden on print) */}
      <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto py-6 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#00324D] dark:text-emerald-400">SENA</span>
            <span>• Servicio Nacional de Aprendizaje — República de Colombia</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Reglamento del Aprendiz (Acuerdo 009 de 2024)</span>
            <span>•</span>
            <button
              onClick={handleResetProgress}
              className="text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reiniciar datos</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => {
          setProfile(updated);
          triggerToast('Datos del aprendiz actualizados', 'xp');
        }}
      />

      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={badges}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        apprenticeName={profile.name}
      />

      <ApprenticeRosterModal
        isOpen={isRosterModalOpen}
        onClose={() => setIsRosterModalOpen(false)}
        roster={roster}
        activeProfile={profile}
        onSelectActiveProfile={handleSelectActiveProfile}
        onAddOrUpdateRecord={handleAddOrUpdateRecord}
        onDeleteRecord={handleDeleteRecord}
        isCertified={isCertified}
        scorePercentage={scorePercentage}
        xp={xp}
        badgesCount={badges.filter((b) => b.unlocked).length}
      />
    </div>
  );
}
