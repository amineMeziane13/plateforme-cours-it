import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  HardDrive,
  FileText
} from 'lucide-react';
import { CourseFile } from '../types';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: CourseFile | null;
  onDeleteSuccess: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, msg: string) => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  file,
  onDeleteSuccess,
  showToast
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !file) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/files/${file.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression.');
      }

      showToast('success', 'Fichier supprimé', `Le fichier "${file.title}" a été définitivement supprimé.`);
      onDeleteSuccess();
      onClose();
    } catch (err: any) {
      showToast('error', 'Échec de la suppression', err.message || 'Une erreur est survenue.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-cyber-card border border-red-500/40 rounded-2xl shadow-glow-red overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-500/30 bg-red-950/30">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-mono">
                Confirmation de suppression
              </h3>
              <p className="text-xs text-red-300">Action irréversible</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Êtes-vous certain de vouloir supprimer définitivement ce support de cours ? Le fichier physique ainsi que toutes ses métadonnées seront supprimés du serveur.
          </p>

          <div className="p-3.5 rounded-xl bg-cyber-darker border border-cyber-border space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white">
              <FileText className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="truncate">{file.title}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Rubrique : {file.rubriqueName} • Fichier : {file.originalName}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-cyber-border bg-cyber-darker/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-cyber-darker border border-cyber-border transition-all"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-glow-red transition-all disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Suppression...' : 'Supprimer définitivement'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
