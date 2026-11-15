import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Search,
  QrCode,
  Download,
  Maximize2,
  Minimize2,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Calendar,
  GraduationCap,
  Sparkles,
  User,
  Info
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StudentData {
  student: {
    id: number;
    matricule: string;
    nin?: string;
    last_name: string;
    first_name: string;
    group_name: string;
    group_level?: string;
    level?: string;
    speciality?: string;
    qr_code_data: string;
  };
  stats: {
    total_absences: number;
    justified_absences: number;
    unjustified_absences: number;
    is_excluded: boolean;
    status: 'regular' | 'caution' | 'danger' | 'excluded';
    reason: string;
    badge_text: string;
  };
  absences_history: Array<{
    id: number;
    session_title: string;
    session_date: string;
    topic: string;
    is_justified: boolean;
    justification_reason: string;
  }>;
}

export const StudentPortalModal: React.FC<StudentPortalModalProps> = ({ isOpen, onClose }) => {
  const [matriculeInput, setMatriculeInput] = useState(() => {
    try {
      return localStorage.getItem('plateforme_student_matricule') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isFullscreenQR, setIsFullscreenQR] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && matriculeInput.trim().length >= 4 && !studentData) {
      handleSearch(matriculeInput.trim());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (matToSearch?: string) => {
    const mat = (matToSearch || matriculeInput).trim();
    if (!mat) {
      setErrorMsg('Veuillez saisir votre numéro de matricule ou NIN.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/student/portal/${encodeURIComponent(mat)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Aucun étudiant trouvé avec ce matricule.');
      }
      const data: StudentData = await res.json();
      setStudentData(data);
      try {
        localStorage.setItem('plateforme_student_matricule', mat);
      } catch {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la récupération des données.');
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  // Convert SVG QR code to Ultra High Definition 1024x1024 PNG
  const downloadQrCodeHD = () => {
    if (!studentData) return;
    const svgElem = qrRef.current?.querySelector('svg');
    if (!svgElem) return;

    const svgXml = new XMLSerializer().serializeToString(svgElem);
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // 1. Crisp Pure White Background with quiet zone margin
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 1024, 1024);

      // 2. Draw sharp QR code
      ctx.drawImage(img, 64, 64, 896, 896);

      // 3. Trigger Download
      const link = document.createElement('a');
      link.download = `QRCode_${studentData.student.last_name}_${studentData.student.matricule}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgXml)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* ── MODE PLEIN ÉCRAN HAUTE LUMINOSITÉ (POUR SCAN FACILE PAR L'ENSEIGNANT) ── */}
      {isFullscreenQR && studentData && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-6 select-none animate-fadeIn">
          <div className="w-full flex items-center justify-between">
            <div className="text-left">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {studentData.student.last_name} {studentData.student.first_name}
              </h2>
              <p className="text-xs font-mono font-bold text-slate-600">
                Matricule : {studentData.student.matricule}
              </p>
              <p className="text-xs font-bold text-indigo-700">
                {studentData.student.group_name}
              </p>
            </div>
            <button
              onClick={() => setIsFullscreenQR(false)}
              className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition font-bold text-xs flex items-center gap-1.5"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Quitter plein écran</span>
            </button>
          </div>

          {/* Huge White Contrast QR Code */}
          <div className="p-6 bg-white border-4 border-slate-900 rounded-3xl shadow-2xl flex items-center justify-center">
            <QRCodeSVG
              value={studentData.student.qr_code_data}
              size={Math.min(window.innerWidth * 0.75, 420)}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-center text-xs font-bold text-slate-600">
            ☀️ Luminosité maximale recommandée • Présentez cet écran devant la caméra de l'enseignant
          </div>
        </div>
      )}

      {/* Main Dialog Box */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-white text-base">Espace Étudiant</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Badge QR & Absences
                </span>
              </div>
              <p className="text-xs text-slate-400">Consultez vos absences et votre code QR officiel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Search Bar */}
          <div className="bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <label className="text-[11px] font-bold text-slate-300 block">
              Saisissez votre numéro de Matricule ou NIN :
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: EP31012026... ou 219971..."
                  value={matriculeInput}
                  onChange={(e) => setMatriculeInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Recherche...' : 'Consulter'}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Student Profile & QR Card */}
          {studentData && (
            <div className="space-y-4 animate-fadeIn">
              {/* Profile Banner */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-base font-extrabold text-white">
                      {studentData.student.last_name} {studentData.student.first_name}
                    </h4>
                  </div>
                  <div className="mt-1 space-y-0.5 text-slate-300">
                    <p className="font-mono text-cyan-300 text-[11px]">
                      Matricule : <span className="font-bold">{studentData.student.matricule}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Groupe : <span className="text-white font-semibold">{studentData.student.group_name}</span> • Niveau : <span className="text-white">{studentData.student.level || studentData.student.group_level || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Exclusion Status Badge */}
                <div className={`px-3.5 py-2 rounded-2xl border text-center font-bold text-xs ${
                  studentData.stats.is_excluded
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/20'
                    : studentData.stats.status === 'danger'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                }`}>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Statut d'Assiduité</div>
                  <div className="text-xs font-black mt-0.5">{studentData.stats.badge_text}</div>
                </div>
              </div>

              {/* QR Code Presentation Box */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
                <div className="space-y-2 max-w-sm">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-bold text-sm">
                    <QrCode className="w-4 h-4 text-cyan-400" />
                    <span>Votre Code QR Haute Définition</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Ce QR Code vectoriel haute qualité peut être scanné directement sur votre écran ou depuis une photo par le smartphone de l'enseignant.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={downloadQrCodeHD}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition shadow active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger Image HD</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFullscreenQR(true)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold rounded-xl text-[11px] flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Mode Plein Écran</span>
                    </button>
                  </div>
                </div>

                {/* The Pure White High-Contrast QR Code */}
                <div
                  ref={qrRef}
                  onClick={() => setIsFullscreenQR(true)}
                  className="p-3.5 bg-white rounded-2xl shadow-xl border-2 border-cyan-400/50 cursor-pointer hover:scale-105 transition shrink-0"
                  title="Cliquez pour agrandir en plein écran"
                >
                  <QRCodeSVG
                    value={studentData.student.qr_code_data}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="text-[9px] font-bold text-slate-800 text-center mt-1">
                    Cliquer pour agrandir
                  </div>
                </div>
              </div>

              {/* Absences Statistics Gauges */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-lg font-black text-white">{studentData.stats.total_absences}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Total Absences</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-lg font-black text-rose-400">{studentData.stats.unjustified_absences}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Non Justifiées (max: 3)</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-lg font-black text-emerald-400">{studentData.stats.justified_absences}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Justifiées</div>
                </div>
              </div>

              {/* History of Missed Sessions */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-white font-bold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Détail des Séances Manquées ({studentData.absences_history.length})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Règlement : Seuil de 5 total ou 3 non-justifiées</span>
                </div>

                {studentData.absences_history.length === 0 ? (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center text-emerald-300 font-bold">
                    ✓ Félicitations ! Vous n'avez aucune absence enregistrée.
                  </div>
                ) : (
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden divide-y divide-slate-800/80">
                    {studentData.absences_history.map((abs, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-900/60 transition">
                        <div>
                          <div className="font-bold text-white text-xs">{abs.session_title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {abs.session_date ? new Date(abs.session_date).toLocaleString('fr-FR') : 'Date non spécifiée'}
                            {abs.topic ? ` • ${abs.topic}` : ''}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            abs.is_justified
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {abs.is_justified ? 'Justifiée' : 'Non justifiée'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
