import React, { useState } from 'react';
import { ApprenticeProfile } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import {
  Printer,
  Download,
  Share2,
  CheckCircle,
  ShieldCheck,
  QrCode,
  Search,
  Award,
  Sparkles,
  Lock,
  Calendar,
  Building,
  Check,
  FileSpreadsheet
} from 'lucide-react';

interface CertificateViewProps {
  profile: ApprenticeProfile;
  scorePercentage: number;
  isCertified: boolean;
  onNavigateToExam: () => void;
  onOpenProfile: () => void;
  onOpenRoster?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  profile,
  scorePercentage,
  isCertified,
  onNavigateToExam,
  onOpenProfile,
  onOpenRoster
}) => {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyInputCode, setVerifyInputCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<'valid' | 'invalid' | null>(null);

  // Generate unique certificate ID from doc number
  const cleanDoc = profile.docNumber.replace(/\D/g, '') || '1024567890';
  const certificateCode = `SENA-IND-2024-${cleanDoc.slice(-4)}-${profile.fichaNumber || '2874'}`;
  const issueDateFormatted = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCheckCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyInputCode.trim().toUpperCase() === certificateCode.toUpperCase()) {
      setVerifyResult('valid');
    } else {
      setVerifyResult('invalid');
    }
  };

  if (!isCertified) {
    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 shadow-xs transition-colors duration-300">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-[#00324D] dark:text-white">
            Certificado Oficial Aún No Desbloqueado
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-md mx-auto">
            Para obtener tu Certificado Oficial de Aprobación de Inducción SENA, debes completar la ruta formativa y aprobar la Evaluación Final con un mínimo del 80%.
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-2">
          <div className="font-bold text-slate-700 dark:text-slate-200">Requisitos para la expedición:</div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span>Aprobar el Examen Final (Mínimo 80%)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span>Completar datos de Aprendiz (Documento y Ficha)</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onNavigateToExam}
            className="px-6 py-3 rounded-xl bg-[#39A900] hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
          >
            Ir a la Evaluación Final
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar (hidden on print) */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Certificado Generado con Éxito
          </div>
          <h2 className="text-xl font-extrabold text-[#00324D] dark:text-white">
            Certificado de Aprobación de Inducción SENA
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Documento con validez de inducción para la ficha {profile.fichaNumber}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenRoster && (
            <button
              onClick={onOpenRoster}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/40 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Hoja de Aprendices (Excel/Sheets)</span>
            </button>
          )}

          <button
            onClick={onOpenProfile}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Editar Datos del Aprendiz
          </button>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Verificar Código</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#00324D] hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Certificate Diploma Canvas */}
      <div className="certificate-print-container bg-white rounded-2xl border-4 border-[#00324D] p-6 sm:p-12 shadow-xl relative overflow-hidden max-w-5xl mx-auto ring-1 ring-slate-200 dark:ring-slate-800">
        {/* Double decorative border line */}
        <div className="absolute inset-2 border-2 border-[#39A900] pointer-events-none rounded-xl"></div>
        <div className="absolute inset-3 border border-slate-200 pointer-events-none rounded-lg"></div>

        {/* Subtle Watermark SENA icon in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none select-none">
          <SenaLogo className="w-[500px] h-[500px]" variant="dark" />
        </div>

        {/* Certificate Content Header */}
        <div className="relative z-10 text-center space-y-3">
          {/* Top Heraldic Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <SenaLogo className="w-14 h-14" />
              <div className="text-left">
                <span className="font-extrabold text-xs tracking-widest uppercase text-slate-800 block">
                  REPÚBLICA DE COLOMBIA
                </span>
                <span className="font-bold text-xs text-[#00324D] block">
                  SERVICIO NACIONAL DE APRENDIZAJE - SENA
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  Dirección de Formación Profesional Integral
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Código de Registro
              </span>
              <span className="font-mono text-xs font-black text-[#00324D] bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block">
                {certificateCode}
              </span>
            </div>
          </div>

          <div className="py-2">
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-emerald-700">
              EL SUBDIRECTOR DEL CENTRO DE FORMACIÓN HACE CONSTAR QUE:
            </span>
          </div>

          {/* Recipient Apprentice Name */}
          <div className="py-4 border-y border-emerald-100/80 bg-emerald-50/20 my-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-cert text-[#00324D] tracking-wide uppercase px-4">
              {profile.name || 'APRENDIZ SENA'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
              Identificado(a) con {profile.docType} No. <span className="font-bold text-slate-800">{profile.docNumber}</span>
            </p>
          </div>

          {/* Certificate Motivation Text */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl mx-auto pt-2">
            Ha cursado, aprobado y demostrado idoneidad en el proceso de <span className="font-bold text-[#00324D]">INDUCCIÓN INSTITUCIONAL Y APROPIACIÓN DEL REGLAMENTO DEL APRENDIZ SENA (Acuerdo 009 de 2024)</span>, cumpliendo a cabalidad con la evaluación integral sobre Derechos, Deberes, Prohibiciones, Régimen Disciplinario, Medidas Formativas y el Debido Proceso ante el Comité de Evaluación y Seguimiento.
          </p>

          {/* Academic metadata fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Programa de Formación</span>
              <span className="text-xs font-bold text-[#00324D] line-clamp-2">{profile.program}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Ficha de Caracterización</span>
              <span className="text-xs font-bold text-[#00324D]">{profile.fichaNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Regional y Centro</span>
              <span className="text-xs font-bold text-[#00324D] truncate block">{profile.center}</span>
            </div>
          </div>

          {/* Performance & Legal note */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 py-1">
            <span className="flex items-center gap-1 text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Calificación: <strong>{scorePercentage}% - APROBADO CON EXCELENCIA</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Expedido el {issueDateFormatted}
            </span>
            <span className="bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
              Intensidad: <strong>40 Horas de Inducción</strong>
            </span>
          </div>

          {/* Signatures & QR Section */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end max-w-3xl mx-auto border-t border-slate-200 mt-6">
            {/* Signature 1 */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif-cert italic text-base text-slate-600 border-b border-slate-400 w-44 inline-block pb-1">
                  Ing. Hernando Gómez R.
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#00324D] block">
                Subdirección de Centro
              </span>
              <span className="text-[9px] text-slate-500 block uppercase">
                Servicio Nacional de Aprendizaje SENA
              </span>
            </div>

            {/* QR Code Validation Badge in Center */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="w-20 h-20 p-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs flex items-center justify-center">
                {/* Stylized QR mockup with SENA colors */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="0" y="0" width="30" height="30" fill="#00324D" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="10" y="10" width="10" height="10" fill="#39A900" />

                  <rect x="70" y="0" width="30" height="30" fill="#00324D" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="80" y="10" width="10" height="10" fill="#39A900" />

                  <rect x="0" y="70" width="30" height="30" fill="#00324D" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="10" y="80" width="10" height="10" fill="#39A900" />

                  {/* Matrix bits */}
                  <rect x="40" y="10" width="8" height="8" fill="#00324D" />
                  <rect x="55" y="15" width="8" height="8" fill="#39A900" />
                  <rect x="35" y="35" width="12" height="12" fill="#00324D" />
                  <rect x="55" y="35" width="8" height="8" fill="#00324D" />
                  <rect x="40" y="55" width="15" height="15" fill="#39A900" />
                  <rect x="70" y="55" width="8" height="8" fill="#00324D" />
                  <rect x="85" y="70" width="10" height="10" fill="#00324D" />
                  <rect x="40" y="80" width="8" height="8" fill="#00324D" />
                  <rect x="60" y="80" width="12" height="12" fill="#39A900" />
                </svg>
              </div>
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-tight">
                Verificación Digital
              </span>
            </div>

            {/* Signature 2 */}
            <div className="text-center space-y-1">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif-cert italic text-base text-slate-600 border-b border-slate-400 w-44 inline-block pb-1">
                  Lic. Sandra Milena Ortiz
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#00324D] block">
                Coordinación Académica y FPI
              </span>
              <span className="text-[9px] text-slate-500 block uppercase">
                Gestión de la Formación Profesional
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#00324D] dark:bg-slate-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base">Validador de Certificados SENA</h3>
              </div>
              <button
                onClick={() => {
                  setShowVerifyModal(false);
                  setVerifyResult(null);
                }}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Ingresa el código alfanumérico que aparece en el encabezado del certificado para verificar su autenticidad en el registro institucional.
              </p>

              <form onSubmit={handleCheckCode} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={verifyInputCode}
                    onChange={(e) => setVerifyInputCode(e.target.value)}
                    placeholder={`Ej. ${certificateCode}`}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-mono font-bold uppercase"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setVerifyInputCode(certificateCode)}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                  >
                    Pegar código actual
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#39A900] hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Consultar Registro de Inducción
                </button>
              </form>

              {verifyResult === 'valid' && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-left space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>CERTIFICADO VÁLIDO Y AUTÉNTICO</span>
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                    <div><strong>Aprendiz:</strong> {profile.name}</div>
                    <div><strong>Documento:</strong> {profile.docType} {profile.docNumber}</div>
                    <div><strong>Programa:</strong> {profile.program}</div>
                    <div><strong>Ficha:</strong> {profile.fichaNumber}</div>
                    <div><strong>Estado:</strong> Aprobado ({scorePercentage}%)</div>
                  </div>
                </div>
              )}

              {verifyResult === 'invalid' && (
                <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-left animate-in fade-in">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                    <span>CÓDIGO NO ENCONTRADO EN LA BASE DE DATOS</span>
                  </div>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-1">
                    Verifica que hayas copiado el código exactamente igual, incluyendo guiones.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
