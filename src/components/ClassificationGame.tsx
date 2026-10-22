import React, { useState } from 'react';
import { CARD_SORT_ITEMS } from '../data/senaRegulationData';
import { CardSortItem } from '../types/induction';
import {
  Zap,
  ShieldCheck,
  BookOpenCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClassificationGameProps {
  onEarnXp: (amount: number, reason: string) => void;
  onUnlockBadge: (badgeId: string) => void;
  onNavigateToCases: () => void;
}

export const ClassificationGame: React.FC<ClassificationGameProps> = ({
  onEarnXp,
  onUnlockBadge,
  onNavigateToCases
}) => {
  const [items, setItems] = useState<CardSortItem[]>([...CARD_SORT_ITEMS]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [answeredState, setAnsweredState] = useState<{
    selectedCategory: 'derecho' | 'deber' | 'prohibicion';
    isCorrect: boolean;
  } | null>(null);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const currentItem = items[currentIndex];

  const handleChoice = (category: 'derecho' | 'deber' | 'prohibicion') => {
    if (answeredState !== null || gameOver) return;

    const isCorrect = category === currentItem.category;
    const newCombo = isCorrect ? combo + 1 : 0;
    setCombo(newCombo);
    if (newCombo > maxCombo) setMaxCombo(newCombo);

    const pointsEarned = isCorrect ? 20 + newCombo * 5 : 0;
    setScore((prev) => prev + pointsEarned);

    setAnsweredState({
      selectedCategory: category,
      isCorrect
    });

    if (isCorrect && newCombo >= 3) {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    setAnsweredState(null);
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setGameOver(true);
      const totalEarnedXp = score + 50;
      onEarnXp(totalEarnedXp, 'Desafío Clasificador SENA superado');
      onUnlockBadge('badge-clasificador');
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestart = () => {
    // Shuffle items
    const shuffled = [...CARD_SORT_ITEMS].sort(() => Math.random() - 0.5);
    setItems(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setAnsweredState(null);
    setGameOver(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Game Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 fill-amber-500" />
            Minijuego Gamificado
          </div>
          <h2 className="text-xl font-extrabold text-[#00324D] dark:text-white">
            Desafío Clasificador del Reglamento SENA
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Analiza el enunciado y clasifícalo velozmente en: Derecho, Deber o Prohibición.
          </p>
        </div>

        {/* Score & Combo */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-center">
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase block">Puntaje</span>
            <span className="text-lg font-black text-amber-900 dark:text-amber-200">{score} pts</span>
          </div>

          <div className="px-3.5 py-1.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-xl text-center">
            <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 uppercase block flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 text-orange-500 fill-orange-500" /> Racha
            </span>
            <span className="text-lg font-black text-orange-900 dark:text-orange-200">x{combo}</span>
          </div>
        </div>
      </div>

      {!gameOver ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>Tarjeta {currentIndex + 1} de {items.length}</span>
            <span>Progreso: {Math.round(((currentIndex + 1) / items.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            ></div>
          </div>

          {/* Central Card to Classify */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center relative overflow-hidden transition-all duration-300">
            <div className="absolute top-4 left-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Identifica la naturaleza jurídica
            </div>
            {currentItem.articleRef && (
              <div className="absolute top-4 right-4 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                Acuerdo 009/2024
              </div>
            )}

            <div className="my-8 max-w-xl mx-auto">
              <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-snug">
                "{currentItem.text}"
              </p>
            </div>

            {/* Answer Feedback Alert if answered */}
            {answeredState !== null && (
              <div
                className={`p-5 rounded-2xl mb-6 text-left border animate-in fade-in zoom-in-95 duration-200 ${
                  answeredState.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-base mb-1.5">
                  {answeredState.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>¡Correcto! Es un {currentItem.category.toUpperCase()}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      <span>¡Incorrecto! La categoría correcta es: {currentItem.category.toUpperCase()}</span>
                    </>
                  )}
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 mt-1">
                  {currentItem.explanation}
                </p>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2.5 block">
                  Referencia oficial: {currentItem.articleRef}
                </span>
              </div>
            )}

            {/* Interactive Classification Buttons */}
            {answeredState === null ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4">
                <button
                  onClick={() => handleChoice('derecho')}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-600/40 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-500 hover:text-white text-emerald-900 dark:text-emerald-300 font-black text-base sm:text-lg transition-all transform hover:-translate-y-1 shadow-xs cursor-pointer group"
                >
                  <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400 group-hover:text-white" />
                  <span>DERECHO</span>
                  <span className="text-xs font-normal opacity-80 group-hover:opacity-100">Facultad / Garantía</span>
                </button>

                <button
                  onClick={() => handleChoice('deber')}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-blue-500/40 dark:border-blue-600/40 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-600 hover:text-white text-blue-900 dark:text-blue-300 font-black text-base sm:text-lg transition-all transform hover:-translate-y-1 shadow-xs cursor-pointer group"
                >
                  <BookOpenCheck className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                  <span>DEBER</span>
                  <span className="text-xs font-normal opacity-80 group-hover:opacity-100">Obligación / Compromiso</span>
                </button>

                <button
                  onClick={() => handleChoice('prohibicion')}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-rose-500/40 dark:border-rose-600/40 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-600 hover:text-white text-rose-900 dark:text-rose-300 font-black text-base sm:text-lg transition-all transform hover:-translate-y-1 shadow-xs cursor-pointer group"
                >
                  <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400 group-hover:text-white" />
                  <span>PROHIBICIÓN</span>
                  <span className="text-xs font-normal opacity-80 group-hover:opacity-100">Conducta Vetada</span>
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-[#00324D] dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-extrabold text-base shadow-md transition-all cursor-pointer"
                >
                  <span>{currentIndex < items.length - 1 ? 'Siguiente Tarjeta' : 'Ver Resultados del Desafío'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 shadow-sm transition-colors duration-300">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8 fill-amber-500" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-[#00324D] dark:text-white">
              ¡Desafío Clasificador Completado!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Has demostrado tu capacidad para discernir los pilares del Reglamento del Aprendiz SENA.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Puntaje Total</span>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{score} pts</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Máxima Racha</span>
              <span className="text-2xl font-black text-orange-600 dark:text-orange-400">x{maxCombo} 🔥</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Jugar Nuevamente</span>
            </button>
            <button
              onClick={onNavigateToCases}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-600 text-white font-bold text-sm shadow-md cursor-pointer"
            >
              <span>Continuar a los Dilemas Éticos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
