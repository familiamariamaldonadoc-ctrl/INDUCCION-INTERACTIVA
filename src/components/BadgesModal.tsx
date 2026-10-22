import React from 'react';
import { Badge } from '../types/induction';
import {
  Award,
  X,
  Compass,
  ShieldCheck,
  BookOpenCheck,
  AlertTriangle,
  Scale,
  Zap,
  BrainCircuit,
  Lock,
  CheckCircle2
} from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, badges }) => {
  if (!isOpen) return null;

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const cls = `w-7 h-7 ${unlocked ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`;
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
      case 'Zap':
        return <Zap className={cls} />;
      case 'BrainCircuit':
        return <BrainCircuit className={cls} />;
      default:
        return <Award className={cls} />;
    }
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-[#00324D] to-[#014264] dark:from-slate-950 dark:to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black">Medallero de Inducción SENA</h2>
              <p className="text-xs text-emerald-300">
                Has desbloqueado {unlockedCount} de {badges.length} insignias de excelencia
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  badge.unlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.unlocked
                      ? 'bg-amber-100 dark:bg-amber-950/80 ring-2 ring-amber-300 dark:ring-amber-700'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                >
                  {badge.unlocked ? getBadgeIcon(badge.iconName, true) : <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                      {badge.title}
                    </h4>
                    {badge.unlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                    {badge.description}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight block">
                    Requisito: {badge.requirement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#00324D] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors cursor-pointer"
          >
            Cerrar Medallero
          </button>
        </div>
      </div>
    </div>
  );
};
