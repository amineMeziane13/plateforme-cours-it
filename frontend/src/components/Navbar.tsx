import React from 'react';
import { 
  Terminal, 
  UploadCloud, 
  FolderPlus, 
  LogOut, 
  KeyRound, 
  Sun, 
  Moon,
  UserCheck,
  Users
} from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenUpload: () => void;
  onOpenRubriquesManager: () => void;
  onOpenLeaderPortal: () => void;
  onOpenLeaderManager: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  theme,
  onToggleTheme,
  onOpenUpload,
  onOpenRubriquesManager,
  onOpenLeaderPortal,
  onOpenLeaderManager,
  onLoginClick,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-cyber-border/80 bg-white/95 dark:bg-cyber-black/90 backdrop-blur-md transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-[1.5px] shadow-sm">
              <div className="w-full h-full bg-white dark:bg-cyber-black rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-mono">
                  IT<span className="text-blue-600 dark:text-cyan-400">.ACADEMY</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-blue-500/20">
                  v3.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                Portail Académique & Pédagogique — Dr. M.A. Meziane
              </p>
            </div>
          </div>

          {/* Center Navigation Info */}
          <div className="hidden lg:flex items-center space-x-2 font-medium text-xs">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-cyber-card/60 border border-slate-200 dark:border-cyber-border text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Mode Lecture Haute-Fidélité Actif</span>
            </div>
          </div>

          {/* Actions, Theme Switcher & Admin Controls */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
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

            {/* Group Leader Portal Button (For students & delegates) */}
            <button
              onClick={onOpenLeaderPortal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 transition-all shadow-xs"
              title="Espace Délégués de groupe : contacter l'enseignant"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Espace Délégués</span>
            </button>

            {/* Admin-only controls */}
            {isAdmin ? (
              <>
                {/* Admin Leaders & Messages Manager */}
                <button
                  onClick={onOpenLeaderManager}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-300 dark:border-purple-800 transition-all shadow-xs"
                  title="Gérer les délégués et répondre aux messages"
                >
                  <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="hidden sm:inline">Délégués & Messages</span>
                </button>

                {/* Rubriques Manager */}
                <button
                  onClick={onOpenRubriquesManager}
                  className="hidden md:inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-cyber-card hover:bg-slate-200 dark:hover:bg-cyber-hover border border-slate-200 dark:border-cyber-border transition-all"
                  title="Gérer les rubriques et sous-rubriques"
                >
                  <FolderPlus className="w-4 h-4 text-cyan-600 dark:text-cyber-cyan" />
                  <span>Rubriques</span>
                </button>

                {/* Upload Button */}
                <button
                  onClick={onOpenUpload}
                  className="relative inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-xs transition-all active:scale-95"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-blue-100" />
                  <span className="hidden sm:inline">Déposer</span>
                </button>

                {/* Exit Admin Button */}
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/80 border border-red-300 dark:border-red-500/40 transition-all shadow-xs"
                  title="Quitter le mode Administrateur et revenir en mode consultation étudiante"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Mode Étudiant</span>
                </button>
              </>
            ) : (
              /* Public / Student Mode: Login to Admin */
              <button
                onClick={onLoginClick}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-cyber-card/80 hover:bg-slate-200 dark:hover:bg-cyber-card border border-slate-200 dark:border-cyber-border transition-all"
                title="Accéder à l'espace Administrateur / Enseignant"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Espace Enseignant</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
