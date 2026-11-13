import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Plus, 
  Trash2, 
  Folder,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  CornerDownRight,
  Edit3,
  Check
} from 'lucide-react';
import { Rubrique } from '../types';
import * as api from '../api';

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
  const [expandedRubriqueId, setExpandedRubriqueId] = useState<string | null>(null);

  // New rubrique form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [color, setColor] = useState<'blue' | 'red' | 'cyan'>('blue');
  const [badge, setBadge] = useState('IT');

  // Edit rubrique form state
  const [editingRubriqueId, setEditingRubriqueId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editColor, setEditColor] = useState<'blue' | 'red' | 'cyan'>('blue');
  const [editBadge, setEditBadge] = useState('IT');

  // New sous-rubrique form state
  const [addingSubForRubriqueId, setAddingSubForRubriqueId] = useState<string | null>(null);
  const [subName, setSubName] = useState('');
  const [subDescription, setSubDescription] = useState('');

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

  const startEditRubrique = (rub: Rubrique) => {
    setEditingRubriqueId(rub.id);
    setEditName(rub.name);
    setEditDescription(rub.description || '');
    setEditColor((rub.color as any) || 'blue');
    setEditBadge(rub.badge || 'IT');
  };

  const handleUpdateRubrique = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('error', 'Nom requis', 'Le nom de la rubrique est obligatoire.');
      return;
    }

    try {
      await api.updateRubrique(id, {
        name: editName.trim(),
        description: editDescription.trim(),
        color: editColor,
        badge: editBadge.trim()
      });
      showToast('success', 'Rubrique mise à jour', `La rubrique "${editName}" a été enregistrée dans la base de données.`);
      setEditingRubriqueId(null);
      onRefresh();
    } catch (err: any) {
      showToast('error', 'Erreur de modification', err.message || 'Impossible de mettre à jour la rubrique.');
    }
  };

  const handleDelete = async (rub: Rubrique) => {
    if ((rub.filesCount || 0) > 0) {
      showToast('error', 'Suppression bloquée', `Cette rubrique contient encore ${rub.filesCount} fichier(s). Veuillez d'abord supprimer ou déplacer ces fichiers.`);
      return;
    }

    if (!window.confirm(`Supprimer la rubrique "${rub.name}" et ses sous-rubriques éventuelles ?`)) return;

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

  const handleAddSousRubrique = async (rubriqueId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) {
      showToast('error', 'Nom requis', 'Le nom de la sous-rubrique est obligatoire.');
      return;
    }

    try {
      await api.addSousRubrique(rubriqueId, {
        name: subName.trim(),
        description: subDescription.trim()
      });
      showToast('success', 'Sous-rubrique créée', `La sous-rubrique "${subName}" a été ajoutée.`);
      setSubName('');
      setSubDescription('');
      setAddingSubForRubriqueId(null);
      onRefresh();
    } catch (err: any) {
      showToast('error', 'Erreur', err.message);
    }
  };

  const handleDeleteSousRubrique = async (rubriqueId: string, subId: string, subNameParam: string) => {
    if (!window.confirm(`Supprimer la sous-rubrique "${subNameParam}" ?`)) return;

    try {
      await api.deleteSousRubrique(rubriqueId, subId);
      showToast('success', 'Sous-rubrique supprimée', `La sous-rubrique "${subNameParam}" a été retirée.`);
      onRefresh();
    } catch (err: any) {
      showToast('error', 'Erreur', err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border rounded-2xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-cyber-border bg-slate-50 dark:bg-cyber-darker">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-mono">
                Gestion des Rubriques & Sous-rubriques
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Organisez l'arborescence des matières et chapitres IT.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Add New Rubrique Trigger / Form */}
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-3 rounded-xl border border-dashed border-blue-400 dark:border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-xs font-semibold flex items-center justify-center space-x-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une nouvelle rubrique principale</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-blue-200 dark:border-blue-500/30 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">Nouvelle Rubrique Principale</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Fermer
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 uppercase mb-1">Nom de la rubrique *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Cryptographie & Sécurité Blockchain"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notions de chiffrement asymétrique, hash, consensus..."
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 uppercase mb-1">Couleur</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border text-slate-900 dark:text-white text-xs outline-none"
                  >
                    <option value="blue">Bleu Électrique</option>
                    <option value="red">Rouge Crimson (Accent)</option>
                    <option value="cyan">Cyan Néon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-700 dark:text-slate-300 uppercase mb-1">Badge</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ex : IT / Avancé"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border text-slate-900 dark:text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  Ajouter la rubrique
                </button>
              </div>
            </form>
          )}

          {/* Existing Rubriques List with Sub-rubriques Accordion */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
              Rubriques Existantes ({rubriques.length})
            </h4>

            {rubriques.map((rub) => {
              const isExpanded = expandedRubriqueId === rub.id;
              const subList = rub.sousRubriques || [];

              return (
                <div
                  key={rub.id}
                  className="rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-200 dark:border-cyber-border overflow-hidden transition-all"
                >
                  {/* Rubrique Item Bar */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div 
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                      onClick={() => setExpandedRubriqueId(isExpanded ? null : rub.id)}
                    >
                      <button className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        rub.color === 'red'
                          ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                          : rub.color === 'cyan'
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30'
                          : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                      }`}>
                        <Layers className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">{rub.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                            {rub.filesCount || 0} cours
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 font-mono">
                            {subList.length} sous-rubrique{subList.length > 1 ? 's' : ''}
                          </span>
                        </div>
                        {rub.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{rub.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 pl-2">
                      <button
                        onClick={() => startEditRubrique(rub)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-cyan-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all text-xs"
                        title="Modifier cette rubrique"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setExpandedRubriqueId(rub.id);
                          setAddingSubForRubriqueId(rub.id);
                        }}
                        className="p-1.5 rounded-lg text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all text-xs flex items-center space-x-1"
                        title="Ajouter une sous-rubrique"
                      >
                        <FolderPlus className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(rub)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                        title="Supprimer la rubrique"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inline Edit Rubrique Form */}
                  {editingRubriqueId === rub.id && (
                    <form 
                      onSubmit={(e) => handleUpdateRubrique(e, rub.id)} 
                      className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border-t border-b border-blue-200 dark:border-blue-900/60 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-700 dark:text-cyan-400 font-mono uppercase">
                          Modifier la rubrique : {rub.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingRubriqueId(null)}
                          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        >
                          Fermer
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-600 dark:text-slate-300 mb-1">
                            Nom de la rubrique *
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border text-xs outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono uppercase text-slate-600 dark:text-slate-300 mb-1">
                            Badge
                          </label>
                          <input
                            type="text"
                            value={editBadge}
                            onChange={(e) => setEditBadge(e.target.value)}
                            placeholder="Ex: IT / Avancé"
                            className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border text-xs outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-slate-600 dark:text-slate-300 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border text-xs outline-none focus:border-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center space-x-2">
                          <label className="text-[10px] font-mono uppercase text-slate-600 dark:text-slate-300">Couleur :</label>
                          <select
                            value={editColor}
                            onChange={(e) => setEditColor(e.target.value as any)}
                            className="px-2 py-1 rounded bg-white dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border text-xs outline-none text-slate-900 dark:text-white"
                          >
                            <option value="blue">Bleu Électrique</option>
                            <option value="red">Rouge Crimson (Accent)</option>
                            <option value="cyan">Cyan Néon</option>
                          </select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingRubriqueId(null)}
                            className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Enregistrer dans la base</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Expanded Sub-rubriques List */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-200/70 dark:border-cyber-border/60 bg-white/50 dark:bg-cyber-card/40 space-y-2.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Sous-rubriques de "{rub.name}"</span>
                      </div>

                      {/* Add Sub-rubrique Inline Form */}
                      {addingSubForRubriqueId === rub.id ? (
                        <form onSubmit={(e) => handleAddSousRubrique(rub.id, e)} className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 space-y-2">
                          <input
                            type="text"
                            value={subName}
                            onChange={(e) => setSubName(e.target.value)}
                            placeholder="Nom de la sous-rubrique (ex: Cryptographie Asymétrique)..."
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border rounded-md text-slate-900 dark:text-white outline-none focus:border-blue-500"
                            required
                            autoFocus
                          />
                          <input
                            type="text"
                            value={subDescription}
                            onChange={(e) => setSubDescription(e.target.value)}
                            placeholder="Description courte (optionnelle)..."
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border rounded-md text-slate-900 dark:text-white outline-none focus:border-blue-500"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setAddingSubForRubriqueId(null)}
                              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-white"
                            >
                              Annuler
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs"
                            >
                              Enregistrer la sous-rubrique
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setAddingSubForRubriqueId(rub.id)}
                          className="text-xs text-blue-600 dark:text-cyan-400 hover:underline flex items-center space-x-1 py-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter une sous-rubrique à ce dossier</span>
                        </button>
                      )}

                      {/* Sub-rubriques tags / rows */}
                      {subList.length === 0 ? (
                        <div className="text-xs text-slate-400 italic py-1">
                          Aucune sous-rubrique configurée pour le moment.
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {subList.map((sub) => (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border text-xs"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.name}</span>
                                {sub.description && (
                                  <span className="text-[11px] text-slate-400 max-w-sm truncate hidden sm:inline">
                                    — {sub.description}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteSousRubrique(rub.id, sub.id, sub.name)}
                                className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
                                title="Supprimer cette sous-rubrique"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
