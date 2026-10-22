import React, { useState } from 'react';
import { CASE_DILEMMAS } from '../data/senaRegulationData';
import { CaseDilemma, CaseOption } from '../types/induction';
import {
  BrainCircuit,
  User,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Award,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseSimulatorProps {
  onEarnXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onNavigateToExam: () => void;
}

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({
  onEarnXp,
  onUnlockBadge,
  onNavigateToExam
}) => {
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<CaseOption | null>(null);
  const [solvedCases, setSolvedCases] = useState<Record<string, boolean>>({});
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [allFinished, setAllFinished] = useState<boolean>(false);

  const dilemma: CaseDilemma = CASE_DILEMMAS[currentDilemmaIndex];

  const handleSelectOption = (option: CaseOption) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);

    if (option.isBestChoice) {
      setTotalPoints((prev) => prev + option.points);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
    setSolvedCases((prev) => ({ ...prev, [dilemma.id]: true }));
  };

  const handleNextDilemma = () => {
    setSelectedOption(null);
    if (currentDilemmaIndex < CASE_DILEMMAS.length - 1) {
      setCurrentDilemmaIndex((prev) => prev + 1);
    } else {
      setAllFinished(true);
      onEarnXp(totalPoints + 100, 'Resolución de dilemas reales del aprendiz SENA');
      onUnlockBadge('badge-casos');
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentDilemmaIndex(0);
    setSelectedOption(null);
    setSolvedCases({});
    setTotalPoints(0);
    setAllFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wider mb-1">
            <BrainCircuit className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Simulador de Casos Reales
          </div>
          <h2 className="text-xl font-extrabold text-[#00324D] dark:text-white">
            Dilemas del Aprendiz SENA
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Analiza situaciones cotidianas en centros de formación o empresas y toma la decisión correcta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 rounded-xl text-center">
            <span className="text-[10px] font-bold text-cyan-800 dark:text-cyan-300 uppercase block">Puntos Éticos</span>
            <span className="text-lg font-black text-cyan-900 dark:text-cyan-200">{totalPoints} pts</span>
          </div>
        </div>
      </div>

      {!allFinished ? (
        <div className="space-y-6">
          {/* Step Pill Trackers */}
          <div className="flex items-center gap-2">
            {CASE_DILEMMAS.map((d, idx) => (
              <div
                key={d.id}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  idx === currentDilemmaIndex
                    ? 'bg-cyan-600 dark:bg-cyan-400'
                    : solvedCases[d.id]
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Scenario Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors duration-300">
            {/* Story Header */}
            <div className="bg-linear-to-r from-slate-900 via-[#00324D] to-slate-800 dark:from-slate-950 dark:via-[#001e30] dark:to-slate-900 text-white p-6">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-md">
                  Caso {currentDilemmaIndex + 1} de {CASE_DILEMMAS.length}
                </span>
                <span className="text-xs text-slate-300 dark:text-slate-400">
                  📜 {dilemma.articleRef}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white">
                {dilemma.title}
              </h3>

              <div className="flex items-center gap-2 mt-2 text-xs text-emerald-300 font-medium">
                <User className="w-3.5 h-3.5" />
                <span>Protagonista: {dilemma.character}</span>
              </div>
            </div>

            {/* Context Story Narrative */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-800/60 border-l-4 border-cyan-600 dark:border-cyan-400 p-4 rounded-r-xl">
                <span className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                  Contexto de la situación:
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  {dilemma.context}
                </p>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-[#00324D] dark:text-white mb-4">
                  ❓ {dilemma.question}
                </h4>

                {/* Option Buttons */}
                <div className="space-y-3">
                  {dilemma.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === opt;
                    return (
                      <button
                        key={oIdx}
                        disabled={selectedOption !== null}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                          selectedOption === null
                            ? 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/30 text-slate-800 dark:text-slate-200 shadow-2xs'
                            : isSelected
                            ? opt.isBestChoice
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30'
                            : opt.isBestChoice
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-300'
                            : 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? opt.isBestChoice
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-rose-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consequence & Teaching Point Box after answering */}
              {selectedOption !== null && (
                <div className="space-y-4 pt-2 animate-in fade-in zoom-in-95 duration-200">
                  <div
                    className={`p-4 rounded-xl border ${
                      selectedOption.isBestChoice
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm mb-1">
                      {selectedOption.isBestChoice ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>¡Decisión Correcta! (+{selectedOption.points} XP)</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>Consecuencia Formatíva</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {selectedOption.feedback}
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Impacto: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedOption.consequence}</span>
                    </div>
                  </div>

                  {/* Teaching Point */}
                  <div className="bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800/60 rounded-xl p-3.5 flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-cyan-900 dark:text-cyan-300 block">
                        Principio Clave del Reglamento SENA:
                      </span>
                      <p className="text-xs text-cyan-800 dark:text-cyan-200 leading-relaxed mt-0.5">
                        {dilemma.teachingPoint}
                      </p>
                    </div>
                  </div>

                  {/* Next Button */}
                  <div className="pt-2">
                    <button
                      onClick={handleNextDilemma}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#39A900] hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      <span>{currentDilemmaIndex < CASE_DILEMMAS.length - 1 ? 'Siguiente Caso Práctico' : 'Ver Resultado de los Casos'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Completion Card */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 shadow-sm transition-colors duration-300">
          <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-[#00324D] dark:text-white">
              ¡Casos Prácticos Completados!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
              Has demostrado comprender las implicaciones legales y formativas del día a día como aprendiz SENA.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-xs mx-auto">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Puntos Éticos Ganados</span>
            <span className="text-2xl font-black text-cyan-700 dark:text-cyan-400">{totalPoints} pts</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir Dilemas</span>
            </button>
            <button
              onClick={onNavigateToExam}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-600 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              <span>Presentar Evaluación Final para Certificarme</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
