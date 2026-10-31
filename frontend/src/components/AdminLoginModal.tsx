import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  ShieldAlert,
  Lock, 
  User, 
  Mail, 
  Send, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  RefreshCw 
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestingCode, setRequestingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Request dynamic credentials sent to amine.blackline@gmail.com
  const handleRequestDynamicCredentials = async () => {
    setRequestingCode(true);
    try {
      const data = await api.requestDynamicCredentials();
      setCodeSent(true);
      setSentMessage(data.message || 'Identifiants envoyés à amine.blackline@gmail.com');

      if (data.tempCredentials) {
        // Auto-fill for convenience if returned by backend
        setUsername(data.tempCredentials.username);
        setPassword(data.tempCredentials.password);
        showToast(
          'success', 
          'Accès Dynamiques Générés', 
          `Identifiants temporaires transmis pour amine.blackline@gmail.com (valables 10 min).`
        );
      } else {
        showToast(
          'success', 
          'Email Envoyé !', 
          `Vérifiez votre boîte de réception amine.blackline@gmail.com pour récupérer votre code temporaire.`
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
      showToast('error', 'Champs requis', 'Veuillez saisir votre identifiant et mot de passe.');
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
        `Bienvenue dans l'espace administrateur sécurisé (${data.user?.authType === 'DYNAMIC_EMAIL_OTP' ? 'OTP Email validé' : 'Accès validé'}).`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-cyber-card border border-blue-500/40 rounded-2xl shadow-glow-blue overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-darker">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 shadow-glow-red">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white font-mono">
                  Espace Administrateur Sécurisé
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/40">
                  2FA Dynamique
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Authentification temporaire liée à <strong className="text-blue-400 font-mono">amine.blackline@gmail.com</strong>
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

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Email OTP Security Banner & Trigger */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 via-cyber-darker to-red-950/30 border border-blue-500/30 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                  Accès Dynamique par Email
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                10 min de validité
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pour une sécurité maximale, un identifiant et un mot de passe temporaires sont générés dynamiquement et envoyés à :
              <br />
              <strong className="text-blue-400 font-mono font-semibold">amine.blackline@gmail.com</strong>
            </p>

            <button
              type="button"
              onClick={handleRequestDynamicCredentials}
              disabled={requestingCode}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-glow-blue transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {requestingCode ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Génération et envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-cyan-300" />
                  <span>{codeSent ? 'Renvoyer un nouveau code par Email' : 'Envoyer mes identifiants dynamiques par Email'}</span>
                </>
              )}
            </button>

            {codeSent && (
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{sentMessage || 'Identifiants temporaires transmis avec succès.'}</span>
              </div>
            )}
          </div>

          {/* Username Input */}
          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Nom d'utilisateur reçu</span>
              </span>
              <span className="text-[10px] text-slate-400">ex: admin ou admin_xxxx</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Saisissez l'identifiant reçu (ou 'admin')"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-blue-400 text-white text-sm outline-none transition-all font-mono placeholder-slate-600"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="flex items-center justify-between text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>Mot de passe temporaire (OTP)</span>
              </span>
              <span className="text-[10px] text-red-400 font-mono">ex: SEC-XXXXXX</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez le mot de passe dynamique reçu par email"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-red-400 text-white text-sm outline-none transition-all font-mono placeholder-slate-600"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-red-600 hover:from-blue-500 hover:to-red-500 shadow-glow-blue transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>{loading ? 'Vérification en cours...' : 'Valider et Déverrouiller l\'Espace Admin'}</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <span className="text-[11px] text-slate-500">
              Protection sécurisée SSL / Session chiffrée • Accès restreint à l'administrateur
            </span>
          </div>

        </form>

      </div>
    </div>
  );
};
