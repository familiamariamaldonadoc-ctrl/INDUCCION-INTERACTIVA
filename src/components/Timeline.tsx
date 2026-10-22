import React, { useState, useMemo } from 'react';
import { TimelineMilestone, MilestoneCategory } from '../types/induction';
import {
  BookOpen,
  Award,
  FileCheck2,
  Zap,
  BrainCircuit,
  ShieldCheck,
  UserCheck,
  Calendar,
  Sparkles,
  ArrowDownUp,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

interface TimelineProps {
  milestones: TimelineMilestone[];
  apprenticeName: string;
  totalXp?: number;
}

export const Timeline: React.FC<TimelineProps> = ({
  milestones,
  apprenticeName,
  totalXp
}) => {
  const [selectedFilter, setSelectedFilter] = useState<MilestoneCategory | 'todos'>('todos');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // default: newest first

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      todos: milestones.length,
      modulo: 0,
      medalla: 0,
      evaluacion: 0,
      certificado: 0,
      registro: 0,
      juego: 0
    };
    milestones.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return counts;
  }, [milestones]);

  // Filtered and sorted list
  const filteredMilestones = useMemo(() => {
    let list = selectedFilter === 'todos'
      ? [...milestones]
      : milestones.filter((m) => m.category === selectedFilter);

    list.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [milestones, selectedFilter, sortOrder]);

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString;
      return new Intl.DateTimeFormat('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 2) return 'Recién registrado';
      if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
      if (diffHours < 24) return `Hace ${diffHours} h`;
      if (diffDays === 1) return 'Ayer';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      return '';
    } catch {
      return '';
    }
  };

  const getCategoryConfig = (category: MilestoneCategory) => {
    switch (category) {
      case 'registro':
        return {
          label: 'Caracterización',
          icon: UserCheck,
          bgClass: 'bg-emerald-50 dark:bg-emerald-950/40',
          borderClass: 'border-emerald-200 dark:border-emerald-800',
          textClass: 'text-emerald-700 dark:text-emerald-300',
          nodeColor: 'bg-emerald-600 ring-emerald-200 dark:ring-emerald-900'
        };
      case 'modulo':
        return {
          label: 'Módulo Formativo',
          icon: BookOpen,
          bgClass: 'bg-blue-50 dark:bg-blue-950/40',
          borderClass: 'border-blue-200 dark:border-blue-800',
          textClass: 'text-blue-700 dark:text-blue-300',
          nodeColor: 'bg-[#00324D] dark:bg-blue-600 ring-blue-200 dark:ring-blue-900'
        };
      case 'medalla':
        return {
          label: 'Insignia Obtenida',
          icon: Award,
          bgClass: 'bg-amber-50 dark:bg-amber-950/40',
          borderClass: 'border-amber-200 dark:border-amber-800',
          textClass: 'text-amber-800 dark:text-amber-300',
          nodeColor: 'bg-amber-500 ring-amber-200 dark:ring-amber-900'
        };
      case 'evaluacion':
        return {
          label: 'Evaluación Final',
          icon: FileCheck2,
          bgClass: 'bg-purple-50 dark:bg-purple-950/40',
          borderClass: 'border-purple-200 dark:border-purple-800',
          textClass: 'text-purple-700 dark:text-purple-300',
          nodeColor: 'bg-purple-600 ring-purple-200 dark:ring-purple-900'
        };
      case 'juego':
        return {
          label: 'Reto & Simulador',
          icon: Zap,
          bgClass: 'bg-cyan-50 dark:bg-cyan-950/40',
          borderClass: 'border-cyan-200 dark:border-cyan-800',
          textClass: 'text-cyan-800 dark:text-cyan-300',
          nodeColor: 'bg-cyan-600 ring-cyan-200 dark:ring-cyan-900'
        };
      case 'certificado':
        return {
          label: 'Certificación Oficial',
          icon: ShieldCheck,
          bgClass: 'bg-emerald-100 dark:bg-emerald-950/60',
          borderClass: 'border-emerald-300 dark:border-emerald-700',
          textClass: 'text-emerald-800 dark:text-emerald-200',
          nodeColor: 'bg-[#39A900] ring-emerald-300 dark:ring-emerald-800'
        };
      default:
        return {
          label: 'Hito',
          icon: CheckCircle2,
          bgClass: 'bg-slate-50 dark:bg-slate-800',
          borderClass: 'border-slate-200 dark:border-slate-700',
          textClass: 'text-slate-700 dark:text-slate-300',
          nodeColor: 'bg-slate-600 ring-slate-200 dark:ring-slate-700'
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar with controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Historial Cronológico de Hitos
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            {milestones.length} registrados
          </span>
        </div>

        {/* Sort order switch */}
        <button
          onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Cambiar orden cronológico"
        >
          <ArrowDownUp className="w-3.5 h-3.5" />
          <span>{sortOrder === 'desc' ? 'Más recientes primero' : 'Primeros pasos primero'}</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
        <button
          onClick={() => setSelectedFilter('todos')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFilter === 'todos'
              ? 'bg-[#00324D] dark:bg-emerald-950 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Todos ({categoryCounts.todos || 0})
        </button>

        <button
          onClick={() => setSelectedFilter('modulo')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFilter === 'modulo'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Módulos ({categoryCounts.modulo || 0})
        </button>

        <button
          onClick={() => setSelectedFilter('medalla')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFilter === 'medalla'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Medallas ({categoryCounts.medalla || 0})
        </button>

        <button
          onClick={() => setSelectedFilter('evaluacion')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFilter === 'evaluacion'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Evaluaciones ({categoryCounts.evaluacion || 0})
        </button>

        <button
          onClick={() => setSelectedFilter('certificado')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFilter === 'certificado'
              ? 'bg-[#39A900] text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Certificación ({categoryCounts.certificado || 0})
        </button>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 pt-2 pb-2">
        {/* Continuous vertical timeline connector line */}
        <div
          className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-700"
          aria-hidden="true"
        ></div>

        {filteredMilestones.length === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400">
            <Clock className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600 mb-2 opacity-60" />
            <p className="text-sm font-semibold">No hay hitos registrados en esta categoría.</p>
            <p className="text-xs text-slate-400 mt-1">
              Continúa avanzando en la inducción para registrar tus logros cronológicamente.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMilestones.map((item, idx) => {
              const cfg = getCategoryConfig(item.category);
              const Icon = cfg.icon;
              const relativeTime = getRelativeTime(item.timestamp);

              return (
                <div key={item.id || idx} className="relative group">
                  {/* Timeline Node Icon / Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full ${cfg.nodeColor} text-white flex items-center justify-center ring-4 shadow-sm z-10 transition-transform group-hover:scale-110`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {/* Milestone Card */}
                  <div className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/90 dark:border-slate-700/80 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                      {/* Category tag & Title */}
                      <div className="flex items-center flex-wrap gap-2 min-w-0">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${cfg.bgClass} ${cfg.borderClass} ${cfg.textClass}`}
                        >
                          {cfg.label}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {item.title}
                        </h4>
                      </div>

                      {/* Timestamp & Relative time */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{formatTimestamp(item.timestamp)}</span>
                        {relativeTime && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                              {relativeTime}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
                      {item.description}
                    </p>

                    {/* Bottom Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                      {typeof item.xpEarned === 'number' && item.xpEarned > 0 && (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/70 dark:border-amber-800/60">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          +{item.xpEarned} XP Ganados
                        </span>
                      )}

                      {typeof item.score === 'number' && item.score > 0 && (
                        <span className="inline-flex items-center gap-1 font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-200/70 dark:border-purple-800/60">
                          <CheckCircle2 className="w-3 h-3 text-purple-500" />
                          Calificación: {item.score}%
                        </span>
                      )}

                      {item.badgeTitle && (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/70 dark:border-amber-800/60">
                          <Award className="w-3 h-3 text-amber-500" />
                          {item.badgeTitle}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 ml-auto">
                        <CheckCircle2 className="w-3 h-3" />
                        Hito completado
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
