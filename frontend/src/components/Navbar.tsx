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
  Users,
  ShieldCheck,
  Sparkles,
  QrCode,
  Database
} from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenUpload: () => void;
  onOpenRubriquesManager: () => void;
  onOpenLeaderPortal: () => void;
  onOpenLeaderManager: () => void;
  onOpenStudentPortal: () => void;
  onOpenAttendanceSync?: () => void;
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
  onOpenStudentPortal,
  onOpenAttendanceSync,
  onLoginClick,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-cyan-500/20 shadow-md shadow-slate-900/5 transition-all">
      
      {/* Animated Futuristic Laser Shimmer Border */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 animate-pulse pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Academic Brand */}
          <div className="flex items-center space-x-3.5 group cursor-pointer">
            
            {/* 3D Holographic Cube Icon */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center overflow-hidden">
                <Terminal className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white font-mono">
                  IT<span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">.ACADEMY</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>v3.5 PRO</span>
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                Plateforme Pédagogique Universitaire • <span className="font-bold text-slate-700 dark:text-slate-200">Dr. M.A. Meziane</span>
              </p>
            </div>

          </div>

          {/* Actions & Interactive Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              className="relative p-2.5 rounded-2xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Basculer en Thème Clair' : 'Basculer en Thème Sombre'}
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '12s' }} />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Group Leader Portal Button */}
            <button
              onClick={onOpenLeaderPortal}
              className="group relative inline-flex items-center space-x-2 px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-indigo-900/60 dark:hover:to-blue-900/60 border border-indigo-200 dark:border-indigo-800 shadow-sm hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
              title="Espace Délégués de groupe : contacter l'enseignant"
            >
              <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 group-hover:rotate-12 transition-transform duration-200" />
              <span className="hidden sm:inline">Délégués</span>
            </button>

            {/* Student Portal Button (QR Code & Absences) */}
            <button
              onClick={onOpenStudentPortal}
              className="group relative inline-flex items-center space-x-2 px-3.5 py-2 sm:py-2.5 rounded-2xl text-xs font-bold text-cyan-700 dark:text-cyan-300 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 hover:from-cyan-100 hover:to-blue-100 dark:hover:from-cyan-900/60 dark:hover:to-blue-900/60 border border-cyan-300 dark:border-cyan-800 shadow-sm hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
              title="Espace Étudiant : Consultez vos absences et votre code QR officiel HD"
            >
              <QrCode className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform duration-200" />
              <span>Espace Étudiant</span>
            </button>

            {/* Admin Controls */}
            {isAdmin ? (
              <>
                {/* Attendance Sync Button */}
                {onOpenAttendanceSync && (
                  <button
                    onClick={onOpenAttendanceSync}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 rounded-2xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-300 dark:border-indigo-800 transition-all shadow-sm hover:scale-105 active:scale-95"
                    title="Synchroniser avec Assiduité Pro"
                  >
                    <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="hidden lg:inline">Sync Présences</span>
                  </button>
                )}
                {/* Admin Leaders & Messages Manager */}
                <button
                  onClick={onOpenLeaderManager}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 rounded-2xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-300 dark:border-purple-800 transition-all shadow-sm hover:scale-105 active:scale-95"
                  title="Gérer les délégués et répondre aux messages"
                >
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="hidden md:inline">Délégués & Messages</span>
                </button>

                {/* Rubriques Manager */}
                <button
                  onClick={onOpenRubriquesManager}
                  className="hidden md:inline-flex items-center space-x-1.5 px-3 py-2 sm:py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all shadow-sm hover:scale-105 active:scale-95"
                  title="Gérer les rubriques et sous-rubriques"
                >
                  <FolderPlus className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>Rubriques</span>
                </button>

                {/* Upload Button */}
                <button
                  onClick={onOpenUpload}
                  className="relative inline-flex items-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-blue-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <UploadCloud className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">Déposer</span>
                </button>

                {/* Exit Admin Button */}
                <button
                  onClick={onLogout}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-2xl text-xs font-bold text-red-700 dark:text-red-300 bg-red-100/80 hover:bg-red-200 dark:bg-red-950/60 dark:hover:bg-red-900/80 border border-red-300 dark:border-red-500/40 transition-all shadow-sm hover:scale-105 active:scale-95"
                  title="Revenir en mode consultation étudiante"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Mode Étudiant</span>
                </button>
              </>
            ) : (
              /* Public / Student Mode: Login to Admin */
              <button
                onClick={onLoginClick}
                className="group relative inline-flex items-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-600 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-cyan-500/20 hover:scale-105 active:scale-95"
                title="Accéder à l'espace Administrateur / Enseignant"
              >
                <KeyRound className="w-4 h-4 text-blue-600 dark:text-cyan-400 group-hover:text-white transition-colors" />
                <span className="hidden sm:inline">Espace Enseignant</span>
              </button>
            )}

          </div>

        </div>
      </div>

    </header>
  );
};