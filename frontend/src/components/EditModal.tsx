import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Edit3, 
  FileCheck, 
  UploadCloud, 
  Layers, 
  BookOpen, 
  User, 
  Tag, 
  AlignLeft,
  GraduationCap
} from 'lucide-react';
import { CourseFile, Rubrique } from '../types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: CourseFile | null;
  rubriques: Rubrique[];
  onEditSuccess: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, msg: string) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  file,
  rubriques,
  onEditSuccess,
  showToast
}) => {
  const [title, setTitle] = useState('');
  const [rubriqueId, setRubriqueId] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Licence 3');
  const [professor, setProfessor] = useState('');
  const [tags, setTags] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      setTitle(file.title);
      setRubriqueId(file.rubriqueId);
      setDescription(file.description || '');
      setLevel(file.level || 'Licence 3');
      setProfessor(file.professor || '');
      setTags(Array.isArray(file.tags) ? file.tags.join(', ') : '');
      setNewFile(null);
    }
  }, [file]);

  if (!isOpen || !file) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('error', 'Titre manquant', 'Le titre du support ne peut pas être vide.');
      return;
    }

    if (!rubriqueId) {
      showToast('error', 'Rubrique requise', 'Le fichier doit être rattaché à une rubrique.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('rubriqueId', rubriqueId);
      formData.append('description', description.trim());
      formData.append('level', level);
      formData.append('professor', professor.trim());
      formData.append('tags', tags.trim());
      
      if (newFile) {
        formData.append('file', newFile);
      }

      const res = await fetch(`/api/files/${file.id}`, {
        method: 'PUT',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la modification du fichier.');
      }

      showToast('success', 'Fichier mis à jour', `Le cours "${title}" a été modifié avec succès.`);
      onEditSuccess();
      onClose();
    } catch (err: any) {
      showToast('error', 'Échec de la modification', err.message || 'Une erreur est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-darker">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyber-blueLight shadow-glow-blue">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-mono">
                Modifier le support de cours
              </h3>
              <p className="text-xs text-slate-400">
                Fichier actuel : <span className="text-slate-300 font-mono">{file.originalName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Rubrique Selector (Allows moving file between rubriques) */}
          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <span className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-cyber-cyan" />
                <span>Rubrique Associée *</span>
              </span>
              <span className="text-[10px] text-cyan-400">Déplacer vers une autre rubrique</span>
            </label>
            <select
              value={rubriqueId}
              onChange={(e) => setRubriqueId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-cyan-400 text-white text-sm outline-none transition-all"
            >
              {rubriques.map((rub) => (
                <option key={rub.id} value={rub.id} className="bg-cyber-darker text-white">
                  {rub.name} ({rub.badge || 'Rubrique'})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Titre du cours / document *</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-blue-400 text-white text-sm outline-none transition-all"
            />
          </div>

          {/* Level & Professor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>Niveau / Promotion</span>
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-blue-400 text-white text-sm outline-none transition-all"
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

            <div>
              <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Enseignant</span>
              </label>
              <input
                type="text"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="Dr. Marc Valery"
                className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-blue-400 text-white text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2 rounded-xl bg-cyber-darker border border-cyber-border focus:border-blue-400 text-white text-sm outline-none transition-all resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              <span>Mots-clés</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-blue-400 text-white text-sm outline-none transition-all font-mono text-xs"
            />
          </div>

          {/* Optional: Replace Attached File */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              Remplacer le document joint (optionnel)
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border border-dashed border-cyber-border hover:border-blue-400/50 rounded-xl p-3 bg-cyber-darker text-center transition-all"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && setNewFile(e.target.files[0])}
                className="hidden"
              />
              {newFile ? (
                <div className="flex items-center justify-center space-x-2 text-emerald-400 text-xs">
                  <FileCheck className="w-4 h-4" />
                  <span>Nouveau fichier sélectionné : {newFile.name}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-slate-400 text-xs">
                  <UploadCloud className="w-4 h-4 text-blue-400" />
                  <span>Cliquez pour remplacer le fichier actuel par une nouvelle version</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-cyber-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-cyber-darker border border-cyber-border transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-glow-blue transition-all disabled:opacity-50"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
