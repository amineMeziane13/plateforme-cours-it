import React from 'react';
import { 
  Terminal, 
  ShieldAlert, 
  UploadCloud, 
  FolderPlus, 
  LogOut, 
  KeyRound, 
  Sun, 
  Moon 
} from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenUpload: () => void;
  onOpenRubriquesManager: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  theme,
  onToggleTheme,
  onOpenUpload,
  onOpenRubriquesManager,
  onLoginClick,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-cyber-border/80 bg-white/95 dark:bg-cyber-black/90 backdrop-blur-md transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-white dark:bg-cyber-black rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-blue-600 dark:text-cyber-blueLight" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-mono">
                  IT<span className="text-blue-600 dark:text-cyber-blueLight">.ACADEMY</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyber-blueLight border border-blue-200 dark:border-blue-500/20">
                  v2.8
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                Plateforme Académique & Dépôt de Ressources IT
              </p>
            </div>
          </div>

          {/* Center Navigation Info */}
          <div className="hidden md:flex items-center space-x-1 font-medium text-sm">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-cyber-card/60 border border-slate-200 dark:border-cyber-border text-xs text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Serveur IT : Opérationnel</span>
            </div>
          </div>

          {/* Actions, Theme Switcher & Admin Controls */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-cyber-card hover:bg-slate-200 dark:hover:bg-cyber-hover border border-slate-200 dark:border-cyber-border transition-all"
              title={theme === 'dark' ? 'Basculer en Thème Blanc (Clair)' : 'Basculer en Thème Sombre'}
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="relative inline-flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-sm transition-all duration-200 active:scale-95"
            >
              <UploadCloud className="w-4 h-4 text-blue-100" />
              <span>Déposer un fichier</span>
            </button>

            {/* Rubriques Manager (Admin) */}
            {isAdmin && (
              <button
                onClick={onOpenRubriquesManager}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-cyber-card hover:bg-slate-200 dark:hover:bg-cyber-hover border border-slate-200 dark:border-cyber-border transition-all"
                title="Gérer les rubriques"
              >
                <FolderPlus className="w-4 h-4 text-cyan-600 dark:text-cyber-cyan" />
                <span>Rubriques</span>
              </button>
            )}

            {/* Admin Toggle / Auth Button */}
            {isAdmin ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-cyber-border">
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/80 border border-red-300 dark:border-red-500/40 transition-all shadow-xs"
                  title="Quitter le mode Administrateur et revenir en mode consultation étudiante"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Quitter Admin (Mode Étudiant)</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-cyber-card/80 hover:bg-slate-200 dark:hover:bg-cyber-card border border-slate-200 dark:border-cyber-border transition-all"
                title="Accéder à l'espace Administrateur"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Espace Admin</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
