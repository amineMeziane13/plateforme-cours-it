import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, Check, AlertCircle, Database, Sparkles } from 'lucide-react';
import { api } from '../api';

interface AttendanceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: () => void;
}

export const AttendanceSyncModal: React.FC<AttendanceSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResultMsg(null);
    }
  };

  const handleUploadAndSync = async () => {
    if (!file) {
      setResultMsg({ type: 'error', text: 'Veuillez sélectionner le fichier JSON exporté depuis Assiduité Pro.' });
      return;
    }

    setLoading(true);
    setResultMsg(null);

    try {
      const fileContent = await file.text();
      const payload = JSON.parse(fileContent);

      if (!payload.students || !Array.isArray(payload.students)) {
        throw new Error("Format JSON non reconnu. Le fichier doit contenir la clé 'students'.");
      }

      const resData = await api.syncAttendance(payload);

      setResultMsg({
        type: 'success',
        text: `✓ ${resData.message || 'Données synchronisées avec succès !'}`
      });
      setFile(null);
      if (onSyncSuccess) onSyncSuccess();
    } catch (err: any) {
      setResultMsg({
        type: 'error',
        text: err.message || 'Erreur lors de la synchronisation.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/15 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Synchroniser Présences AssiduitePro</h3>
              <p className="text-xs text-slate-400">Importez le fichier JSON exporté depuis votre application</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Cette opération met à jour la liste des étudiants, leurs groupes, leurs séances et leurs absences pour alimenter l'Espace Étudiant en ligne. Les cours et fichiers existants sur la plateforme ne sont pas affectés.
          </p>

          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 text-center transition bg-slate-950/40">
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="attendance-json-upload"
            />
            <label
              htmlFor="attendance-json-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/30">
                <UploadCloud className="w-6 h-6" />
              </div>
              <span className="font-bold text-white text-xs">
                {file ? file.name : "Cliquez pour sélectionner le fichier assiduite_pro_plateforme_sync.json"}
              </span>
              <span className="text-[10px] text-slate-400">
                {file ? `${(file.size / 1024).toFixed(1)} Ko` : "Format JSON valide uniquement"}
              </span>
            </label>
          </div>

          {resultMsg && (
            <div
              className={`p-3 rounded-2xl border flex items-center gap-2 text-xs ${
                resultMsg.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              }`}
            >
              {resultMsg.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{resultMsg.text}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl"
            >
              Fermer
            </button>
            <button
              type="button"
              disabled={!file || loading}
              onClick={handleUploadAndSync}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 active:scale-95 flex items-center gap-2"
            >
              {loading ? 'Synchronisation...' : 'Importer et Mettre à Jour'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
