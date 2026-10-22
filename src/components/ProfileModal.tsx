import React, { useState, useEffect } from 'react';
import { ApprenticeProfile, DocType, TimelineMilestone } from '../types/induction';
import { SENA_PROGRAMS, SENA_REGIONALES } from '../data/senaRegulationData';
import { Timeline } from './Timeline';
import {
  User,
  X,
  Check,
  Award,
  School,
  Building2,
  Hash,
  IdCard,
  Clock,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ApprenticeProfile;
  onSaveProfile: (profile: ApprenticeProfile) => void;
  milestones?: TimelineMilestone[];
  xp?: number;
  scorePercentage?: number;
  isCertified?: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  milestones = [],
  xp = 100,
  scorePercentage = 0,
  isCertified = false
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'timeline'>('profile');
  const [formData, setFormData] = useState<ApprenticeProfile>(profile);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 600);
  };

  const handleRegionalCenterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = SENA_REGIONALES[parseInt(e.target.value, 10)];
    if (selected) {
      setFormData({
        ...formData,
        regional: selected.regional,
        center: selected.center
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#00324D] dark:bg-slate-950 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs font-bold text-base">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{profile.name || 'Perfil del Aprendiz'}</h2>
                {isCertified && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/50">
                    Certificado
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-300">
                Ficha: {profile.fichaNumber || '2874921'} · {profile.program || 'Programa de Formación'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation in Profile Modal */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-slate-50 dark:bg-slate-900/50 shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-emerald-600 text-[#00324D] dark:text-emerald-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Datos de la Ficha</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-emerald-600 text-[#00324D] dark:text-emerald-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Línea de Tiempo ('Timeline')</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              {milestones.length}
            </span>
          </button>
        </div>

        {/* Modal Body Content */}
        {activeTab === 'timeline' ? (
          <div className="p-6 overflow-y-auto flex-1">
            <Timeline
              milestones={milestones}
              apprenticeName={profile.name}
              totalXp={xp}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Nombres y Apellidos */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Nombres y Apellidos Completos *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. María Fernanda Maldonado Cortés"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Tipo y Número de Documento */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Tipo Doc.
                </label>
                <select
                  value={formData.docType}
                  onChange={(e) => setFormData({ ...formData, docType: e.target.value as DocType })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-800 bg-white"
                >
                  <option value="CC">C.C.</option>
                  <option value="TI">T.I.</option>
                  <option value="CE">C.E.</option>
                  <option value="PEP">PEP</option>
                  <option value="PPT">PPT</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Número de Documento *
                </label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.docNumber}
                    onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                    placeholder="Ej. 1024567890"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Programa de Formación */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Programa de Formación *
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-800 bg-white"
                >
                  {SENA_PROGRAMS.map((prog, idx) => (
                    <option key={idx} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Número de Ficha de Caracterización */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Ficha de Caracterización (SofiaPlus / Zajuna) *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.fichaNumber}
                  onChange={(e) => setFormData({ ...formData, fichaNumber: e.target.value })}
                  placeholder="Ej. 2874921"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Regional y Centro de Formación */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Regional y Centro de Formación *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  onChange={handleRegionalCenterSelect}
                  defaultValue="0"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-slate-800 bg-white"
                >
                  {SENA_REGIONALES.map((item, idx) => (
                    <option key={idx} value={idx}>
                      {item.regional} — {item.center}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#39A900] hover:bg-emerald-600 text-white text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                {isSavedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Guardar Datos</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
