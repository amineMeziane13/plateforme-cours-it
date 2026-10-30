import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  Lock, 
  User, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';

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
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Connexion échouée');

      localStorage.setItem('it_platform_admin_token', data.token);
      showToast('success', 'Authentification Réussie', 'Mode Administrateur activé avec succès.');
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
      <div className="relative w-full max-w-md bg-cyber-card border border-cyber-border rounded-2xl shadow-glow-blue overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-darker">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyber-blueLight shadow-glow-blue">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-mono">
                Connexion Administrateur
              </h3>
              <p className="text-xs text-slate-400">
                Gestion des rubriques et publication des cours
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Identifiants par défaut pré-remplis : <strong className="text-white">admin</strong> / <strong className="text-white">admin123</strong></span>
          </div>

          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Nom d'utilisateur</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-blue-400 text-white text-sm outline-none transition-all font-mono"
            />
          </div>

          <div>
            <label className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-mono">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>Mot de passe administrateur</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-cyber-darker border border-cyber-border focus:border-blue-400 text-white text-sm outline-none transition-all font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-glow-blue transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>{loading ? 'Vérification...' : 'Déverrouiller l\'Espace Admin'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
