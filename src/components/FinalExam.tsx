import React, { useState } from 'react';
import { FINAL_EXAM_QUESTIONS } from '../data/senaRegulationData';
import { QuizQuestion } from '../types/induction';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FinalExamProps {
  onPassExam: (scorePercentage: number) => void;
  onEarnXp: (amount: number, reason: string) => void;
  onNavigateToCertificate: () => void;
  isAlreadyCertified: boolean;
}

export const FinalExam: React.FC<FinalExamProps> = ({
  onPassExam,
  onEarnXp,
  onNavigateToCertificate,
  isAlreadyCertified
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([...FINAL_EXAM_QUESTIONS]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [scorePercentage, setScorePercentage] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const currentQ = questions[currentQuestionIndex];
  const answeredTotal = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optIndex: number) => {
    if (examSubmitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optIndex
    });
  };

  const handleSubmitExam = () => {
    if (answeredTotal < questions.length) {
      if (!confirm(`Has respondido ${answeredTotal} de ${questions.length} preguntas. ¿Seguro que deseas enviar la evaluación?`)) {
        return;
      }
    }

    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const percent = Math.round((correct / questions.length) * 100);
    setCorrectCount(correct);
    setScorePercentage(percent);
    setExamSubmitted(true);

    if (percent >= 80) {
      onPassExam(percent);
      onEarnXp(250, 'Aprobación de la Evaluación Final de Inducción SENA');
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.4 }
      });
    }
  };

  const handleRetry = () => {
    // Shuffle slightly
    const shuffled = [...FINAL_EXAM_QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamSubmitted(false);
    setScorePercentage(0);
    setCorrectCount(0);
  };

  const isPassed = scorePercentage >= 80;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Evaluación Oficial de Certificación
          </div>
          <h2 className="text-xl font-extrabold text-[#00324D] dark:text-white">
            Examen Integral de Inducción SENA
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            10 preguntas seleccionadas. Requiere puntaje mínimo de 80% (8/10) para expedir tu certificado.
          </p>
        </div>

        {isAlreadyCertified && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Inducción Aprobada</span>
          </div>
        )}
      </div>

      {!examSubmitted ? (
        <div className="space-y-6">
          {/* Question Grid Navigator */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#00324D] dark:bg-emerald-600 text-white shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Respondidas: <span className="font-bold text-slate-900 dark:text-white">{answeredTotal}</span>/{questions.length}
            </div>
          </div>

          {/* Active Question Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors duration-300">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-md">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Valor: 10 pts
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-600 text-purple-950 dark:text-purple-200 ring-2 ring-purple-600/20'
                        : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#00324D] dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#39A900] hover:bg-emerald-600 text-white shadow-md cursor-pointer animate-pulse"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Enviar y Calificar Evaluación</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Post-Exam Result View */
        <div className="space-y-6">
          <div
            className={`rounded-3xl border p-8 text-center space-y-5 shadow-sm transition-colors duration-300 ${
              isPassed
                ? 'bg-linear-to-b from-emerald-50 via-white to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-emerald-300 dark:border-emerald-800'
                : 'bg-linear-to-b from-rose-50 via-white to-white dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner ${
                isPassed ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isPassed ? <Award className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            </div>

            <div>
              <span
                className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                  isPassed
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300/40'
                }`}
              >
                {isPassed ? '¡APROBADO CON EXCELENCIA!' : 'NO ALCANZADO (MÍNIMO 80%)'}
              </span>

              <h3 className="text-2xl sm:text-3xl font-black text-[#00324D] dark:text-white mt-3">
                Tu Calificación: {scorePercentage}%
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Acertaste <span className="font-bold text-slate-800 dark:text-white">{correctCount} de {questions.length}</span> preguntas.
              </p>
            </div>

            {isPassed ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 max-w-md mx-auto text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                🎉 <strong>¡Felicitaciones!</strong> Has superado exitosamente la inducción al Reglamento del Aprendiz SENA. Ya puedes generar y descargar tu Certificado Oficial de Aprobación.
              </div>
            ) : (
              <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 max-w-md mx-auto text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                El reglamento del SENA exige un entendimiento sólido de los derechos, deberes y debido proceso. Repasa los módulos o los dilemas e inténtalo nuevamente.
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar Examen</span>
              </button>

              {isPassed && (
                <button
                  onClick={onNavigateToCertificate}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-600 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Ver mi Certificado Oficial SENA</span>
                </button>
              )}
            </div>
          </div>

          {/* Detailed Question Review with explanations */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 transition-colors duration-300">
            <h4 className="text-lg font-black text-[#00324D] dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Retroalimentación Detallada Pregunta a Pregunta</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Revisa los fundamentos normativos del Acuerdo 009 de 2024 para cada caso evaluado.
            </p>

            <div className="space-y-4 pt-2">
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctIndex;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border ${
                      isCorrect ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1.5 flex-1">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {idx + 1}. {q.question}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">
                          <span className="font-semibold">Tu respuesta: </span>
                          <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-700 dark:text-rose-400 font-bold'}>
                            {userAns !== undefined ? q.options[userAns] : 'No respondida'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <div className="text-xs text-emerald-700 dark:text-emerald-400">
                            <span className="font-semibold">Respuesta correcta: </span>
                            <span className="font-bold">{q.options[q.correctIndex]}</span>
                          </div>
                        )}
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/80 p-2 rounded-md border border-slate-200 dark:border-slate-700 mt-1 leading-relaxed">
                          💡 <strong>Justificación legal:</strong> {q.explanation} (<em>{q.articleRef}</em>)
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
