import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  UserCheck, 
  Lock, 
  User, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import { LeaderMessage, GroupLeader } from '../types';
import * as api from '../api';

interface LeaderPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const LeaderPortalModal: React.FC<LeaderPortalModalProps> = ({
  isOpen,
  onClose,
  onToast
}) => {
  // Session state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('it_portal_leader_token'));
  const [leader, setLeader] = useState<GroupLeader | null>(() => {
    const saved = localStorage.getItem('it_portal_leader_info');
    return saved ? JSON.parse(saved) : null;
  });

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Messaging state
  const [messages, setMessages] = useState<LeaderMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      loadMessages();
    }
  }, [isOpen, token]);

  const loadMessages = async () => {
    if (!token) return;
    setIsLoadingMessages(true);
    try {
      const data = await api.getLeaderMessages(leader?.id);
      setMessages(data);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('401')) {
        handleLogout();
        onToast('error', 'Session expirée', 'Veuillez vous reconnecter.');
      }
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      onToast('error', 'Champs requis', 'Veuillez saisir votre nom d\'utilisateur et mot de passe.');
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await api.loginLeader(username.trim(), password);
      setToken(res.token);
      setLeader(res.leader);
      localStorage.setItem('it_portal_leader_token', res.token);
      localStorage.setItem('it_portal_leader_info', JSON.stringify(res.leader));
      setUsername('');
      setPassword('');
      onToast('success', 'Connexion réussie', `Bienvenue ${res.leader.studentName} (${res.leader.groupName})`);
    } catch (err: any) {
      onToast('error', 'Échec de connexion', err.message || 'Identifiants invalides.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setLeader(null);
    setMessages([]);
    localStorage.removeItem('it_portal_leader_token');
    localStorage.removeItem('it_portal_leader_info');
    onToast('info', 'Déconnexion', 'Vous avez été déconnecté de l\'espace délégué.');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!subject.trim() || !content.trim()) {
      onToast('error', 'Champs incomplets', 'Veuillez renseigner un objet et votre message.');
      return;
    }

    setIsSending(true);
    try {
      const msg = await api.sendLeaderMessage({
        leaderId: leader?.id || '',
        leaderName: leader?.studentName || 'Délégué',
        groupName: leader?.groupName || 'Groupe',
        subject: subject.trim(),
        content: content.trim()
      });
      setMessages([msg, ...messages]);
      setSubject('');
      setContent('');
      onToast('success', 'Message envoyé', 'Votre message a été transmis directement au Dr. Meziane.');
    } catch (err: any) {
      onToast('error', 'Erreur d\'envoi', err.message || 'Impossible d\'envoyer le message.');
    } finally {
      setIsSending(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-cyber-border bg-slate-50/70 dark:bg-cyber-darker">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-cyan-400">
                  Espace Délégués de Groupe
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Liaison Enseignant</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Communication avec le Dr. M.A. Meziane
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {token && (
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all"
                title="Se déconnecter de l'espace délégué"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-cyber-hover transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!token ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-4">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Identification Délégué de Groupe
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Cet espace est réservé aux délégués et responsables de groupe désignés. Les identifiants sont fournis par l'enseignant.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nom d'utilisateur
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ex: delegue_l3_grp1"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border rounded-xl text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                >
                  {isLoggingIn ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>

              <div className="mt-6 p-3.5 rounded-xl bg-slate-50 dark:bg-cyber-darker/60 border border-slate-200 dark:border-cyber-border/70 text-[11px] text-slate-500 dark:text-slate-400 flex items-start space-x-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Vous n'avez pas vos identifiants ? Rapprochez-vous de votre enseignant Dr. Meziane pour qu'il génère votre compte délégué.
                </span>
              </div>
            </div>
          ) : (
            /* Logged in Area */
            <div className="space-y-6">
              {/* Leader Banner */}
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-blue-700 dark:text-cyber-blueLight font-semibold">
                    Délégué connecté :
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {leader?.studentName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Groupe / Section : <span className="font-semibold text-blue-600 dark:text-cyan-400">{leader?.groupName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Canal Ouvert
                  </span>
                </div>
              </div>

              {/* Compose Message Form */}
              <div className="bg-slate-50 dark:bg-cyber-darker/80 p-4 rounded-xl border border-slate-200 dark:border-cyber-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-3 flex items-center space-x-1.5">
                  <Send className="w-3.5 h-3.5 text-blue-500" />
                  <span>Transmettre un message / rapport à l'enseignant</span>
                </h4>

                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Objet (ex: Question sur le TP3, Absence séance, Remarque cours...)"
                      className="w-full px-3.5 py-2 text-xs bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      placeholder="Rédigez votre message ici. Il sera directement consultable par le Dr. Meziane dans son espace enseignant..."
                      className="w-full px-3.5 py-2 text-xs bg-white dark:bg-cyber-card border border-slate-300 dark:border-cyber-border rounded-lg text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSending}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSending ? 'Envoi...' : 'Envoyer à l\'enseignant'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Messages History */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                    <Inbox className="w-3.5 h-3.5 text-blue-500" />
                    <span>Historique de vos échanges ({messages.length})</span>
                  </h4>
                  <button
                    onClick={loadMessages}
                    className="text-[11px] text-blue-600 dark:text-cyan-400 hover:underline"
                  >
                    Actualiser
                  </button>
                </div>

                {isLoadingMessages ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Chargement des messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 dark:border-cyber-border text-xs text-slate-400">
                    Aucun message envoyé pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-xl bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                              {msg.subject}
                            </h5>
                            <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(msg.createdAt)}</span>
                            </span>
                          </div>
                          {msg.reply ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                              Réponse reçue
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50">
                              En attente
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-50 dark:bg-cyber-darker p-3 rounded-lg border border-slate-100 dark:border-cyber-border/40">
                          {msg.content}
                        </p>

                        {/* Admin reply if present */}
                        {msg.reply && (
                          <div className="ml-2 sm:ml-4 pl-3 border-l-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-r-lg space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Réponse du Dr. M.A. Meziane :</span>
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
