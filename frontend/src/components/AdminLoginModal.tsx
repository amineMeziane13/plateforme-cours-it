import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  User, 
  ArrowLeft,
  Mail,
  Send,
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

  // Reset inputs when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setUsername('');
      setPassword('');
      setCodeSent(false);
    }
  }, [isOpen]);

  // Support closing with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Discreet request for temporary OTP without revealing email address
  const handleRequestOtp = async () => {
    setRequestingCode(true);
    try {
      const data = await api.requestDynamicCredentials();
      setCodeSent(true);
      showToast(
        'info', 
        'Code d\'accès demandé', 
        'Si cette demande est autorisée, un code à usage unique a été transmis à l\'adresse de l\'administrateur.'
      );
    } catch (err: any) {
      showToast('error', 'Échec de la demande', err.message || 'Une erreur est survenue.');
    } finally {
      setRequestingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('error', 'Champs requis', 'Veuillez saisir votre identifiant et votre mot de passe.');
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
      if (!res.ok) throw new Error(data.error || 'Identifiants incorrects.');

      localStorage.setItem('it_platform_admin_token', data.token);
      showToast(
        'success', 
        'Connexion Réussie', 
        'Bienvenue dans l\'espace d\'administration.'
      );
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      showToast('error', 'Erreur d\'authentification', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-sm animate-fade-in"
      onClick={onClose} // Clicking the background immediately closes and returns to student mode
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-cyber-card border border-slate-200 dark:border-blue-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-cyber-border bg-slate-50 dark:bg-cyber-darker">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white font-mono">
                Espace Administrateur
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Accès restreint au corps professoral
              </p>
            </div>
          </div>
          
          {/* Close button returning directly to student mode */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Revenir au mode étudiant"
            aria-label="Fermer et revenir en mode étudiant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Username Input - Clean & Empty */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Identifiant</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre identifiant"
              autoComplete="off"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all font-mono placeholder-slate-400"
            />
          </div>

          {/* Password Input - Clean & Empty */}
          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Mot de passe</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              autoComplete="current-password"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-cyber-darker border border-slate-300 dark:border-cyber-border focus:border-blue-500 text-slate-900 dark:text-white text-sm outline-none transition-all font-mono placeholder-slate-400"
            />
          </div>

          {/* Discreet OTP trigger without exposing email */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={requestingCode}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 disabled:opacity-50"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{requestingCode ? 'Envoi du code...' : 'Recevoir un code temporaire par email'}</span>
            </button>
          </div>

          {codeSent && (
            <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Code transmis à l'adresse administrateur enregistrée.</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-blue-100" />
              <span>{loading ? 'Vérification...' : 'Se Connecter à l\'Espace Admin'}</span>
            </button>
          </div>

          {/* PROMINENT BUTTON: REVENIR AU MODE ETUDIANT */}
          <div className="pt-2 border-t border-slate-100 dark:border-cyber-border/60">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Revenir au Mode Étudiant (Annuler)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};