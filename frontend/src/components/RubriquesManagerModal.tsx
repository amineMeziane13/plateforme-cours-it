import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  ShieldAlert, 
  Code2, 
  Network, 
  Terminal, 
  Cloud, 
  Database, 
  Cpu, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Rubrique } from '../types';

interface RubriquesManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubriques: Rubrique[];
  onRefresh: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, msg: string) => void;
}

export const RubriquesManagerModal: React.FC<RubriquesManagerModalProps> = ({
  isOpen,
  onClose,
  rubriques,
  onRefresh,
  showToast
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // New rubrique form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [color, setColor] = useState<'blue' | 'red' | 'cyan'>('blue');
  const [badge, setBadge] = useState('IT');

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Nom requis', 'Le nom de la rubrique est obligatoire.');
      return;
    }

    try {
      const res = await fetch('/api/rubriques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, icon, color, badge })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast('success', 'Rubrique créée', `La rubrique "${name}" a été ajoutée.`);
      setName('');
      setDescription('');
      setIsAdding(false);
      onRefresh();
    } catch (err: any) {
      showToast('error', 'Erreur', err.message);
    }
  };

  const handleDelete = async (rub: Rubrique) => {
    if ((rub.filesCount || 0) > 0) {
      showToast('error', 'Suppression bloquée', `Cette rubrique contient encore ${rub.filesCount} fichier(s). Veuillez d'abord supprimer ou déplacer ces fichiers.`);
      return;
    }

    if (!window.confirm(`Supprimer la rubrique "${rub.name}" ?`)) return;

    try {
      const res = await fetch(`/api/rubriques/${rub.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showToast('success', 'Rubrique supprimée', `La rubrique "${rub.name}" a été supprimée.`);
      onRefresh();
    } catch (err: any) {
      showToast('error', 'Erreur', err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-darker">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-mono">
                Gestion des Rubriques Académiques
              </h3>
              <p className="text-xs text-slate-400">
                Créez, modifiez ou organisez les catégories de cours IT.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Add New Rubrique Form Trigger / Inline Form */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 rounded-xl border border-dashed border-blue-500/40 text-blue-400 hover:text-white hover:bg-blue-950/20 text-xs font-semibold flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une nouvelle rubrique</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-4 rounded-xl bg-cyber-darker border border-blue-500/30 space-y-3.5 shadow-glow-blue">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase font-mono">Nouvelle Rubrique</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Fermer
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">Nom de la rubrique *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Cryptographie & Sécurité Blockchain"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-cyber-card border border-cyber-border focus:border-blue-400 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notions de chiffrement asymétrique, hash, consensus..."
                  className="w-full px-3 py-2 rounded-lg bg-cyber-card border border-cyber-border focus:border-blue-400 text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">Icône</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-cyber-card border border-cyber-border text-white text-xs outline-none"
                  >
                    <option value="Folder">Dossier standard</option>
                    <option value="ShieldAlert">Sécurité (Bouclier)</option>
                    <option value="Code2">Développement (Code)</option>
                    <option value="Network">Réseaux</option>
                    <option value="Terminal">Système / Linux</option>
                    <option value="Database">Bases de données</option>
                    <option value="Cloud">Cloud / DevOps</option>
                    <option value="Cpu">Algorithmes (CPU)</option>
                    <option value="Sparkles">IA / Innovation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">Couleur</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-cyber-card border border-cyber-border text-white text-xs outline-none"
                  >
                    <option value="blue">Bleu Électrique</option>
                    <option value="red">Rouge Crimson (Accent)</option>
                    <option value="cyan">Cyan Néon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ex : Avancé"
                    className="w-full px-3 py-2 rounded-lg bg-cyber-card border border-cyber-border text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue"
                >
                  Ajouter la rubrique
                </button>
              </div>
            </form>
          )}

          {/* Existing Rubriques List */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
              Rubriques Existantes ({rubriques.length})
            </h4>

            {rubriques.map((rub) => (
              <div
                key={rub.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-cyber-darker border border-cyber-border hover:border-slate-700 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    rub.color === 'red'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : rub.color === 'cyan'
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  }`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-white">{rub.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {rub.filesCount || 0} fichier(s)
                      </span>
                    </div>
                    {rub.description && (
                      <p className="text-xs text-slate-400 line-clamp-1">{rub.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(rub)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all"
                    title="Supprimer la rubrique"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
