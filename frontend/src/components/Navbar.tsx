import React, { useState } from 'react';
import { 
  Terminal, 
  ShieldCheck, 
  ShieldAlert, 
  UploadCloud, 
  FolderPlus, 
  LogOut, 
  KeyRound, 
  Layers, 
  Database,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  isAdmin: boolean;
  onOpenUpload: () => void;
  onOpenRubriquesManager: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onOpenUpload,
  onOpenRubriquesManager,
  onLoginClick,
  onLogout
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyber-border/80 bg-cyber-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-red-600 p-[1.5px] shadow-glow-blue">
              <div className="w-full h-full bg-cyber-black rounded-xl flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cyber-blueLight" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-mono">
                  IT<span className="text-cyber-blueLight">.ACADEMY</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-cyber-blueLight border border-blue-500/20">
                  v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Plateforme Académique & Dépôt de Ressources IT
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 font-medium text-sm text-slate-300">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyber-card/60 border border-cyber-border text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Serveur IT : Opérationnel</span>
            </div>
          </div>

          {/* Actions & Admin Controls */}
          <div className="flex items-center space-x-3">
            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="relative inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-glow-blue transition-all duration-200 active:scale-95"
            >
              <UploadCloud className="w-4 h-4 text-cyan-300" />
              <span>Déposer un fichier</span>
            </button>

            {/* Rubriques Manager (Admin) */}
            {isAdmin && (
              <button
                onClick={onOpenRubriquesManager}
                className="hidden sm:inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-cyber-card hover:bg-cyber-hover border border-cyber-border hover:border-cyber-blueLight transition-all"
                title="Gérer les rubriques"
              >
                <FolderPlus className="w-4 h-4 text-cyber-cyan" />
                <span>Rubriques</span>
              </button>
            )}

            {/* Admin Toggle / Auth Button */}
            {isAdmin ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-cyber-border">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold shadow-glow-red">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span className="hidden sm:inline">ADMIN</span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-500/30 transition-all"
                  title="Déconnexion Administrateur"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-cyber-card/80 hover:bg-cyber-card border border-cyber-border hover:border-cyber-blueLight transition-all"
                title="Connexion Administrateur"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Espace Admin</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
