import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert,
  Lock, 
  User, 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { api } from '../api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, msg: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  showToast
}) => {
  // Champs TOUJOURS vides par défaut - aucun pré-remplissage pour garantir la sécurité
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState<boolean | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  // Réinitialiser systématiquement les champs à chaque ouverture/fermeture
  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setCodeSent(false);
      setEmailSentStatus(null);
      setSentMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Demande de génération et d'envoi d'identifiants dynamiques à amine.blackline@gmail.com
  const handleRequestDynamicCredentials = async () => {
    setRequestingCode(true);
    try {
      const data = await api.requestDynamicCredentials();
      setCodeSent(true);
      setEmailSentStatus(!!data.emailSent);
      setSentMessage(data.message || 'Demande traitée');

      if (data.emailSent) {
        showToast(
          'success', 
          'Code Envoyé par Email', 
          `Consultez votre boîte amine.blackline@gmail.com (vérifiez aussi les Spams).`
        );
      } else {
        showToast(
          'error', 
          'Service SMTP non configuré sur Render', 
          `Pour envoyer de vrais emails, ajoutez EMAIL_USER et EMAIL_PASS sur Render.`
        );
      }
    } catch (err: any) {
      showToast('error', 'Échec de la demande', err.message || 'Une erreur est survenue.');
    } finally {
      setRequestingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('error', 'Champs obligatoires', 'Veuillez saisir votre identifiant et mot de passe.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Connexion échouée');

      localStorage.setItem('it_platform_admin_token', data.token);
      showToast(
        'success', 
        'Authentification Réussie', 
        `Bienvenue dans l'espace administrateur sécurisé.`
      );
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      showToast('error', 'Erreur de connexion', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-cyber-card border border-slate-200 dark:border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-cyber-border bg-slate-50 dark:bg-cyber-darker">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white font-mono">
                  Espace Administrateur Sécurisé
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/40">
                  Accès Restreint
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrateur : <strong className="text-blue-600 dark:text-blue-400 font-mono">amine.blackline@gmail.com</strong>
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

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Email OTP Security Banner & Trigger */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 via-slate-50 to-red-50 dark:from-blue-950/40 dark:via-cyber-darker dark:to-red-950/30 border border-blue-200 dark:border-blue-500/30 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                  Option 1 : Code Temporaire par Email
                </span>
              </div>
              <span className="text-[10px] font-mono text-blue-700 dark:text-cyan-300 bg-blue-100 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-cyan-500/30">
                Validité 10 min
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Pour recevoir un identifiant et mot de passe temporaires à usage unique sur :
              <br />
              <strong className="text-blue-600 dark:text-blue-400 font-mono font-semibold">amine.blackline@gmail.com</strong>
            </p>

            <button
              type="button"
              onClick={handleRequestDynamicCredentials}
              disabled={requestingCode}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {requestingCode ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-100" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-blue-100" />
                  <span>{codeSent ? 'Renvoyer un code par Email' : 'Envoyer mes identifiants temporaires par Email'}</span>
                </>
              )}
            </button>

            {codeSent && (
              emailSentStatus ? (
                <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  <span>Email envoyé à amine.blackline@gmail.com (vérifiez également vos Spams).</span>
                </div>
              ) : (
                <div className="text-[11px] text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-xl border border-amber-300 dark:border-amber-500/40 space-y-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-900 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Serveur SMTP non configuré sur Render</span>
                  </div>
                  <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                    Pour recevoir de réels emails, configurez <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded text-amber-900 dark:text-amber-200">EMAIL_USER</code> et <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded text-amber-900 dark:text-amber-200">EMAIL_PASS</code> dans Render &gt; Environment.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 pt-1 border-t border-amber-200 dark:border-amber-500/20">
                    👉 Vous pouvez vous connecter immédiatement ci-dessous avec votre <strong>mot de passe administrateur principal</strong> (Option 2).
                  </p>
                </div>
              )
            )}
          </div>

          {/* Option 2 Header */}
          <div className="flex items-center space-x-1.5 pt-1 text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
            <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Saisie des Identifiants</span>
          </div>

          {/* Username Input - Vide par defaut */}
          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Identifiant</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">amine ou code reçu</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre identifiant (ex: amine ou code reçu)"
              autoComplete="off"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all font-mono placeholder-slate-400"
            />
          </div>

          {/* Password Input - Vide par defaut */}
          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                <span>Mot de passe</span>
              </span>
              <span className="text-[10px] text-red-600 dark:text-red-400 font-mono">OTP ou Mot de passe secret</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              autoComplete="new-password"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-red-500 text-slate-900 dark:text-white text-sm outline-none transition-all font-mono placeholder-slate-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 hover:from-blue-500 hover:to-red-500 shadow-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-blue-100" />
              <span>{loading ? 'Vérification en cours...' : 'Valider et Déverrouiller l\'Espace Admin'}</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Protection sécurisée SSL • Aucun identifiant pré-rempli • Accès restreint
            </span>
          </div>

        </form>

      </div>
    </div>
  );
};
