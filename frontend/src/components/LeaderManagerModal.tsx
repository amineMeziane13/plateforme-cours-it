import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserPlus, 
  Users, 
  MessageSquare, 
  Trash2, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  User,
  Key,
  GraduationCap,
  Layers,
  Search
} from 'lucide-react';
import { GroupLeader, LeaderMessage } from '../types';
import * as api from '../api';

interface LeaderManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const LeaderManagerModal: React.FC<LeaderManagerModalProps> = ({
  isOpen,
  onClose,
  onToast
}) => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'messages'>('messages');
  
  // Accounts state
  const [leaders, setLeaders] = useState<GroupLeader[]>([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [studentName, setStudentName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<LeaderMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replyingId, setReplyingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadLeaders();
      loadMessages();
    }
  }, [isOpen]);

  const loadLeaders = async () => {
    setIsLoadingLeaders(true);
    try {
      const data = await api.getAdminLeaders();
      setLeaders(data);
    } catch (err: any) {
      onToast('error', 'Erreur de chargement', err.message || 'Impossible de charger les délégués.');
    } finally {
      setIsLoadingLeaders(false);
    }
  };

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const data = await api.getAdminMessages();
      setMessages(data);
    } catch (err: any) {
      onToast('error', 'Erreur de chargement', err.message || 'Impossible de charger les messages.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleCreateLeader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || !studentName.trim() || !groupName.trim()) {
      onToast('error', 'Champs requis', 'Tous les champs du formulaire sont obligatoires.');
      return;
    }

    setIsCreating(true);
    try {
      const res = await api.createAdminLeader({
        username: username.trim(),
        password,
        studentName: studentName.trim(),
        groupName: groupName.trim()
      });
      setLeaders([res.leader, ...leaders]);
      setUsername('');
      setPassword('');
      setStudentName('');
      setGroupName('');
      onToast('success', 'Compte créé', `Le compte pour ${res.leader.studentName} a été créé avec succès.`);
    } catch (err: any) {
      onToast('error', 'Erreur de création', err.message || 'Impossible de créer le compte.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteLeader = async (id: string, name: string) => {
    if (!window.confirm(`Confirmez-vous la suppression du compte de délégué de ${name} ?`)) {
      return;
    }

    try {
      await api.deleteAdminLeader(id);
      setLeaders(leaders.filter(l => l.id !== id));
      onToast('success', 'Compte supprimé', `Le compte de ${name} a été révoqué.`);
    } catch (err: any) {
      onToast('error', 'Erreur de suppression', err.message || 'Impossible de supprimer ce compte.');
    }
  };

  const handleReply = async (messageId: string) => {
    const text = replyTexts[messageId]?.trim();
    if (!text) {
      onToast('error', 'Texte requis', 'Veuillez saisir votre réponse avant d\'envoyer.');
      return;
    }

    setReplyingId(messageId);
    try {
      const res = await api.replyAdminMessage(messageId, text);
      const updatedMsg = (res as any).message || res;
      setMessages(messages.map(m => m.id === messageId ? updatedMsg : m));
      setReplyTexts(prev => ({ ...prev, [messageId]: '' }));
      onToast('success', 'Réponse envoyée', 'Votre réponse a été transmise à l\'étudiant délégué.');
    } catch (err: any) {
      onToast('error', 'Erreur d\'envoi', err.message || 'Impossible d\'envoyer la réponse.');
    } finally {
      setReplyingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const unreadCount = messages.filter(m => !m.reply).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-cyber-border bg-slate-50/70 dark:bg-cyber-darker">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase font-bold text-purple-600 dark:text-purple-400">
                  Administration Pédagogique
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Dr. M.A. Meziane</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Gestion des Délégués de Groupe & Messagerie
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-hover transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-cyber-border bg-slate-100/50 dark:bg-cyber-darker/60 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'messages'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-cyber-card'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages Reçus</span>
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-500 text-white font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'accounts'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-cyber-card'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Comptes Délégués ({leaders.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'messages' ? (
            /* Messages Inbox */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {messages.length} message{messages.length > 1 ? 's' : ''} au total ({unreadCount} en attente)
                </span>
                <button
                  onClick={loadMessages}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Actualiser la boîte
                </button>
              </div>

              {isLoadingMessages ? (
                <div className="text-center py-10 text-xs text-slate-400">Chargement des messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 dark:border-cyber-border text-xs text-slate-400">
                  Aucun message reçu des délégués pour le moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border transition-all ${
                        !msg.reply
                          ? 'border-purple-300 dark:border-purple-800 bg-purple-50/20 dark:bg-purple-950/20'
                          : 'border-slate-200 dark:border-cyber-border bg-white dark:bg-cyber-card'
                      }`}
                    >
                      {/* Message Meta */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-cyber-border/40">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {msg.leaderName}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 dark:bg-cyber-darker text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-cyber-border">
                              {msg.groupName}
                            </span>
                            {!msg.reply ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400">
                                Réponse requise
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                                Répondu
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mt-1">
                            Objet : {msg.subject}
                          </div>
                        </div>

                        <span className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(msg.createdAt)}</span>
                        </span>
                      </div>

                      {/* Message Content */}
                      <p className="my-3 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>

                      {/* Existing Reply */}
                      {msg.reply && (
                        <div className="mt-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Votre réponse (Dr. Meziane) :</span>
                            </span>
                            {msg.repliedAt && (
                              <span className="text-[10px] text-slate-400">
                                {formatDate(msg.repliedAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                            {msg.reply}
                          </p>
                        </div>
                      )}

                      {/* Reply Form (if not replied or to update) */}
                      {!msg.reply && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-cyber-border/40 space-y-2">
                          <textarea
                            value={replyTexts[msg.id] || ''}
                            onChange={(e) => setReplyTexts({ ...replyTexts, [msg.id]: e.target.value })}
                            placeholder="Saisissez votre réponse pour cet étudiant délégué..."
                            rows={3}
                            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border rounded-lg text-slate-900 dark:text-white outline-none focus:border-purple-500 resize-none"
                          ></textarea>
                          <div className="flex justify-end">
                            <button
                              onClick={() => handleReply(msg.id)}
                              disabled={replyingId === msg.id}
                              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-xs disabled:opacity-50"
                            >
                              <Send className="w-3 h-3" />
                              <span>{replyingId === msg.id ? 'Transmission...' : 'Envoyer la réponse'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Accounts Management */
            <div className="space-y-8">
              {/* Creation Form */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-200 dark:border-cyber-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white mb-3 flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                  <span>Créer un compte pour un responsable de groupe</span>
                </h3>

                <form onSubmit={handleCreateLeader} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nom et Prénom de l'étudiant
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Ex: Walid Hadj"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border rounded-lg text-slate-900 dark:text-white outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Groupe / Promotion
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Ex: L3 SI - Groupe 1"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border rounded-lg text-slate-900 dark:text-white outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Nom d'utilisateur (Login)
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: delegue_l3_grp1"
                      className="w-full px-3 py-2 text-xs bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border rounded-lg text-slate-900 dark:text-white outline-none focus:border-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe temporaire ou sécurisé"
                        className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border rounded-lg text-slate-900 dark:text-white outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-sm disabled:opacity-50"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{isCreating ? 'Création...' : 'Créer le compte délégué'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Leaders List */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center space-x-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Comptes délégués actifs ({leaders.length})</span>
                </h3>

                {isLoadingLeaders ? (
                  <div className="text-center py-6 text-xs text-slate-400">Chargement...</div>
                ) : leaders.length === 0 ? (
                  <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 dark:border-cyber-border text-xs text-slate-400">
                    Aucun compte délégué configuré pour le moment.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {leaders.map((ldr) => (
                      <div
                        key={ldr.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border shadow-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 dark:text-white">
                            {ldr.studentName}
                          </div>
                          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                            {ldr.groupName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Login : <span className="text-slate-700 dark:text-slate-300">{ldr.username}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteLeader(ldr.id, ldr.studentName)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                          title="Supprimer ce compte délégué"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
