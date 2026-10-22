import React, { useState, useEffect } from 'react';
import { InductionModule } from '../types/induction';
import {
  Compass,
  ShieldCheck,
  BookOpenCheck,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Award,
  HelpCircle,
  Lightbulb,
  Zap,
  BrainCircuit
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ModuleViewerProps {
  modules: InductionModule[];
  onCompleteModule: (moduleId: string, points: number) => void;
  onNavigateToClassifier: () => void;
  onNavigateToCases: () => void;
  onNavigateToExam: () => void;
}

export const ModuleViewer: React.FC<ModuleViewerProps> = ({
  modules,
  onCompleteModule,
  onNavigateToClassifier,
  onNavigateToCases,
  onNavigateToExam
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0].id);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTabSection, setActiveTabSection] = useState<number>(0);

  const currentModule = modules.find((m) => m.id === selectedModuleId) || modules[0];

  // Stop speech when switching modules
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setActiveTabSection(0);
  }, [selectedModuleId]);

  const toggleSpeechNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('La síntesis de voz no está soportada en tu navegador actual.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const section = currentModule.sections[activeTabSection] || currentModule.sections[0];
      const textToRead = `${currentModule.title}. ${section.title}. ${section.content.join('. ')}. Consejo práctico: ${section.practicalTip || ''}`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-CO';
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const getModuleIcon = (iconName: string, active: boolean) => {
    const cls = `w-5 h-5 ${active ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`;
    switch (iconName) {
      case 'Compass':
        return <Compass className={cls} />;
      case 'ShieldCheck':
        return <ShieldCheck className={cls} />;
      case 'BookOpenCheck':
        return <BookOpenCheck className={cls} />;
      case 'AlertTriangle':
        return <AlertTriangle className={cls} />;
      case 'Scale':
        return <Scale className={cls} />;
      default:
        return <BookOpen className={cls} />;
    }
  };

  const handleFinishModule = () => {
    if (!currentModule.completed) {
      onCompleteModule(currentModule.id, currentModule.pointsReward);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    // Auto-advance to next module or next game
    const currentIndex = modules.findIndex((m) => m.id === currentModule.id);
    if (currentIndex < modules.length - 1) {
      setSelectedModuleId(modules[currentIndex + 1].id);
    }
  };

  const completedModulesCount = modules.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedModulesCount / modules.length) * 100);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Top Banner with Progress & Quick Jump */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs transition-colors duration-300 w-full max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full max-w-full">
          <div className="min-w-0 max-w-full flex-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-[#39A900] shrink-0"></span>
              <span className="truncate">Ruta Formativa de Inducción SENA 2024</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#00324D] dark:text-white tracking-tight break-words max-w-full">
              Reglamento del Aprendiz (Acuerdo 009 de 2024)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl break-words">
              Explora los 5 módulos formativos obligatorios para conocer tus deberes, derechos, prohibiciones, el debido proceso y certificarte formalmente.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto sm:min-w-[200px] shrink-0">
            <div className="flex justify-between w-full text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Progreso de Módulos</span>
              <span className="text-emerald-700 dark:text-emerald-400">{completedModulesCount} de {modules.length} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div
                className="h-full bg-[#39A900] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {progressPercent === 100 ? '🎉 ¡Módulos completados!' : 'Completa todos para la Certificación'}
            </span>
          </div>
        </div>

        {/* Horizontal Module Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          {modules.map((mod) => {
            const isSelected = mod.id === currentModule.id;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModuleId(mod.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#00324D] dark:bg-emerald-950 text-white border-[#00324D] dark:border-emerald-600 shadow-md ring-2 ring-emerald-500/50'
                    : mod.completed
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <span
                    className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    Módulo {mod.number}
                  </span>
                  {mod.completed && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                  )}
                </div>
                <span className="text-xs font-bold line-clamp-1">
                  {mod.shortTitle}
                </span>
                <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  +{mod.pointsReward} XP
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Module Detailed Reader */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-300">
        {/* Module Header Strip */}
        <div className="bg-linear-to-r from-[#00324D] via-[#004264] to-[#014264] dark:from-slate-950 dark:via-[#002235] dark:to-slate-900 text-white p-6 sm:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#39A900] flex items-center justify-center shrink-0 shadow-md">
                {getModuleIcon(currentModule.icon, true)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded">
                    Módulo {currentModule.number} de {modules.length}
                  </span>
                  <span className="text-xs text-slate-300">~{currentModule.estimatedMinutes} min lectura</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {currentModule.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1">
                  {currentModule.summary}
                </p>
              </div>
            </div>

            {/* Audio narrator button */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSpeechNarration}
                title="Escuchar narración en audio"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Detener Voz</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Escuchar Audio</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 scrollbar-none">
            {currentModule.sections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveTabSection(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTabSection === idx
                    ? 'bg-white dark:bg-emerald-500 text-[#00324D] dark:text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                Sección {idx + 1}: {sec.badgeTag}
              </button>
            ))}
          </div>
        </div>

        {/* Section Content Display */}
        <div className="p-6 sm:p-8">
          {(() => {
            const currentSection = currentModule.sections[activeTabSection] || currentModule.sections[0];
            return (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-sm">
                      {currentSection.badgeTag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white mt-1.5">
                      {currentSection.title}
                    </h3>
                  </div>
                  {currentSection.keyArticles && (
                    <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      📜 {currentSection.keyArticles}
                    </span>
                  )}
                </div>

                {/* Paragraphs */}
                <div className="space-y-4">
                  {currentSection.content.map((p, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3.5 bg-slate-50/70 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                        {pIdx + 1}
                      </div>
                      <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-200 font-normal">
                        {p}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Practical SENA Tip */}
                {currentSection.practicalTip && (
                  <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                    <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
                        Consejo Práctico del Aprendiz SENA
                      </span>
                      <p className="text-sm sm:text-base text-amber-800 dark:text-amber-200 mt-1 leading-relaxed font-medium">
                        {currentSection.practicalTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Section Navigation buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    disabled={activeTabSection === 0}
                    onClick={() => setActiveTabSection((prev) => Math.max(0, prev - 1))}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ArrowLeft className="w-4.5 h-4.5" />
                    <span>Sección Anterior</span>
                  </button>

                  {activeTabSection < currentModule.sections.length - 1 ? (
                    <button
                      onClick={() => setActiveTabSection((prev) => prev + 1)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-[#00324D] dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white cursor-pointer shadow-xs"
                    >
                      <span>Siguiente Sección</span>
                      <ArrowRight className="w-4.5 h-4.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFinishModule}
                      className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-sm sm:text-base font-extrabold transition-all shadow-md cursor-pointer ${
                        currentModule.completed
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#39A900] hover:bg-emerald-600 text-white animate-bounce'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{currentModule.completed ? 'Módulo Completado (+XP)' : 'Marcar Módulo Completado (+150 XP)'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Gamified Next Activities Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={onNavigateToClassifier}
          className="bg-linear-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-xs cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Minijuego Dinámico
            </span>
            <Zap className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="text-base font-bold">Desafío Clasificador SENA</h4>
          <p className="text-xs text-amber-100 mt-1">
            Pon a prueba tu agilidad clasificando tarjetas rápidas entre Derecho, Deber o Prohibición.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
            <span>Jugar ahora</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={onNavigateToCases}
          className="bg-linear-to-br from-cyan-600 to-blue-700 rounded-2xl p-5 text-white shadow-xs cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Simulador Interactivo
            </span>
            <BrainCircuit className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="text-base font-bold">Dilemas Éticos y Disciplinarios</h4>
          <p className="text-xs text-cyan-100 mt-1">
            Enfrenta 4 situaciones reales de aprendices SENA y toma decisiones basadas en el reglamento.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
            <span>Resolver dilemas</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <div
          onClick={onNavigateToExam}
          className="bg-linear-to-br from-purple-700 to-indigo-800 rounded-2xl p-5 text-white shadow-xs cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Aprobación 80%
            </span>
            <Award className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </div>
          <h4 className="text-base font-bold">Evaluación y Certificación</h4>
          <p className="text-xs text-purple-100 mt-1">
            Rinde el test final oficial para desbloquear y descargar tu Certificado Institucional con QR.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
            <span>Iniciar examen final</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
