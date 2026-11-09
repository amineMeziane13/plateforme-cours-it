import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCheck, 
  Layers, 
  BookOpen, 
  User, 
  Tag, 
  AlignLeft,
  GraduationCap,
  ShieldAlert
} from 'lucide-react';
import { Rubrique } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubriques: Rubrique[];
  defaultRubriqueId?: string;
  onUploadSuccess: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, msg: string) => void;
  isAdmin: boolean;
  onOpenLogin: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  rubriques,
  defaultRubriqueId,
  onUploadSuccess,
  showToast,
  isAdmin,
  onOpenLogin
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [rubriqueId, setRubriqueId] = useState(defaultRubriqueId || (rubriques[0]?.id || ''));
  const [sousRubriqueId, setSousRubriqueId] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Licence 3');
  const [professor, setProfessor] = useState('');
  const [tags, setTags] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      if (!title) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(cleanName);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) {
        const cleanName = selected.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAdmin) {
      showToast('error', 'Accès réservé', 'Veuillez vous authentifier en tant qu\'administrateur pour déposer un fichier.');
      onOpenLogin();
      return;
    }

    if (!file) {
      showToast('error', 'Fichier manquant', 'Veuillez sélectionner un fichier à déposer.');
      return;
    }

    if (!rubriqueId) {
      showToast('error', 'Rubrique obligatoire', 'L\'administrateur doit obligatoirement classer le fichier sous une rubrique.');
      return;
    }

    if (!title.trim()) {
      showToast('error', 'Titre manquant', 'Le titre du support de cours est obligatoire.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('rubriqueId', rubriqueId);
      if (sousRubriqueId) {
        formData.append('sousRubriqueId', sousRubriqueId);
      }
      formData.append('description', description.trim());
      formData.append('level', level);
      formData.append('professor', professor.trim());
      formData.append('tags', tags.trim());

      const res = await fetch('/api/files', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du dépôt du fichier.');
      }

      showToast('success', 'Fichier publié !', `Le cours "${title}" a été ajouté avec succès sous la rubrique sélectionnée.`);
      onUploadSuccess();
      onClose();
    } catch (err: any) {
      showToast('error', 'Échec du dépôt', err.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transition-colors">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-cyber-border bg-slate-50 dark:bg-cyber-darker">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-cyber-blueLight">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-mono">
                Déposer un nouveau fichier de cours
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                L'administrateur classe le fichier sous une rubrique dédiée.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {!isAdmin && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/40 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 text-xs">
                <ShieldAlert className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                <span>Vous êtes en mode visiteur. La publication nécessite une connexion administrateur.</span>
              </div>
              <button
                type="button"
                onClick={onOpenLogin}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-red-600 hover:bg-red-500 text-white transition-all ml-2"
              >
                Se connecter
              </button>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                : file
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/10'
                : 'border-slate-300 dark:border-cyber-border hover:border-blue-400 bg-slate-50 dark:bg-cyber-darker/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                  <FileCheck className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white max-w-sm truncate">
                  {file.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {(file.size / (1024 * 1024)).toFixed(2)} Mo • Cliquez pour changer de fichier
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-cyber-blueLight mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-800 dark:text-white">
                  Glissez-déposez le fichier ici, ou <span className="text-blue-600 dark:text-cyber-blueLight underline">parcourez vos dossiers</span>
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports acceptés : PDF, ZIP, RAR, Scripts (PY, SH, JS, SQL), Diaporamas (PPTX), Docs. Jusqu'à 100 Mo.
                </span>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Rubrique (MANDATORY REQUIREMENT) */}
            <div className="md:col-span-2">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                <span className="flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyber-cyan" />
                  <span>Rubrique Cible (Obligatoire) *</span>
                </span>
                <span className="text-[10px] text-red-500 dark:text-red-400 font-normal">Requis par l'administration</span>
              </label>
              <select
                value={rubriqueId}
                onChange={(e) => {
                  setRubriqueId(e.target.value);
                  setSousRubriqueId('');
                }}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-cyan-500 text-slate-900 dark:text-white text-sm outline-none transition-all"
              >
                <option value="" disabled>-- Sélectionner une rubrique IT --</option>
                {rubriques.map((rub) => (
                  <option key={rub.id} value={rub.id} className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">
                    {rub.name} ({rub.badge || 'Rubrique'})
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Sous-Rubrique if selected rubrique has any */}
            {(() => {
              const currentRub = rubriques.find(r => r.id === rubriqueId);
              if (currentRub && currentRub.sousRubriques && currentRub.sousRubriques.length > 0) {
                return (
                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
                      <span>Sous-rubrique / Chapitre (Optionnel)</span>
                    </label>
                    <select
                      value={sousRubriqueId}
                      onChange={(e) => setSousRubriqueId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all"
                    >
                      <option value="">-- Sans sous-rubrique (Général) --</option>
                      {currentRub.sousRubriques.map((sub) => (
                        <option key={sub.id} value={sub.id} className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              return null;
            })()}

            {/* Course Title */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Titre du cours / document *</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Architecture Pare-feu & DMZ Avancée"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all placeholder-slate-400"
              />
            </div>

            {/* Level / Year */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Niveau / Promotion</span>
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all"
              >
                <option value="Licence 1">Licence 1 (L1)</option>
                <option value="Licence 2">Licence 2 (L2)</option>
                <option value="Licence 3">Licence 3 (L3)</option>
                <option value="Master 1">Master 1 (M1)</option>
                <option value="Master 2">Master 2 (M2)</option>
                <option value="Certification / Pro">Certification / Pro</option>
                <option value="Tous niveaux">Tous niveaux</option>
              </select>
            </div>

            {/* Professor */}
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Enseignant / Intervenant</span>
              </label>
              <input
                type="text"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="Ex : Dr. Marc Valery"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all placeholder-slate-400"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                <AlignLeft className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Description & Objectifs Pédagogiques</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Explication des notions abordées, prérequis ou instructions pour les exercices..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all placeholder-slate-400 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                <Tag className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Mots-clés / Tags (séparés par des virgules)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="sécurité, cisco, parefeu, docker, iptables"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all placeholder-slate-400 font-mono text-xs"
              />
            </div>

          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-cyber-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-cyber-darker hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-cyber-border transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 hover:from-blue-500 hover:to-red-500 shadow-sm transition-all disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4 text-blue-100" />
              <span>{isSubmitting ? 'Téléversement en cours...' : 'Publier sous la rubrique'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
