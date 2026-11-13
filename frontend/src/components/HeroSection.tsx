import React from 'react';
import { 
  FileText, 
  FolderTree, 
  Eye, 
  HardDrive, 
  Search, 
  X, 
  Sparkles,
  BookOpen,
  Users
} from 'lucide-react';
import { PlatformStats } from '../types';
import { WelcomeAvatar } from './WelcomeAvatar';

interface HeroSectionProps {
  stats: PlatformStats | null;
  search: string;
  onSearchChange: (val: string) => void;
  isAdmin: boolean;
  onOpenUpload: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  search,
  onSearchChange,
  isAdmin,
  onOpenUpload
}) => {
  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Mo';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${Math.round(bytes / 1024)} Ko`;
    if (mb > 1000) return `${(mb / 1024).toFixed(1)} Go`;
    return `${mb.toFixed(1)} Mo`;
  };

  const visitorCount = stats?.visitorCount || 0;

  return (
    <div className="relative pt-6 sm:pt-8 pb-10 overflow-hidden border-b border-slate-200 dark:border-cyber-border/40 bg-gradient-to-b from-white via-slate-50 to-slate-50 dark:from-cyber-black dark:via-cyber-black dark:to-cyber-darker transition-colors">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-red-500/5 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Tag & Admin Privileges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-cyber-blueLight text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-pulse"></span>
            <span>PORTAIL DES COURS & TRAVAUX PRATIQUES IT</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Live Visitor Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Visiteurs : <strong className="font-bold">{visitorCount.toLocaleString('fr-FR')}</strong></span>
            </div>

            {isAdmin && (
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Privilèges Enseignant / Administrateur</span>
              </div>
            )}
          </div>
        </div>

        {/* Hero Top Grid: Title & Search on left, 3D Avatar Welcome Card on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
          
          {/* Left Column: Heading and Search */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
              Centre de Ressources{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                Informatiques & Télécoms
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl">
              Consultez directement en ligne vos cours magistraux, travaux dirigés et supports de travaux pratiques avec l'interface de lecture haute fidélité optimisée.
            </p>

            {/* Search Bar */}
            <div className="mt-6 max-w-xl">
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher un cours (ex: Réseaux, Docker, Sécurité, L3, M1)..."
                  className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-cyber-card/90 border border-slate-300 dark:border-cyber-border focus:border-blue-500 dark:focus:border-cyber-blueLight focus:ring-2 focus:ring-blue-500/20 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 text-sm transition-all shadow-sm outline-none"
                />
                {search && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Animated Welcome Avatar Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative p-5 sm:p-6 rounded-3xl bg-white/80 dark:bg-cyber-card/80 border border-blue-100 dark:border-blue-500/20 shadow-xl backdrop-blur-md w-full max-w-md card-3d">
              <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                Assistant Virtuel IT
              </div>
              <WelcomeAvatar visitorCount={visitorCount} />
            </div>
          </div>

        </div>

        {/* Live Metrics Grid with 3D Medallions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Card 1: Fichiers & Documents */}
          <div className="bg-white dark:bg-cyber-card rounded-2xl p-4 border border-slate-200 dark:border-cyber-border hover:border-blue-400 dark:hover:border-blue-500/40 transition-all cyber-card shadow-xs group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Documents</span>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-800 shadow-[0_6px_12px_-2px_rgba(59,130,246,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats ? stats.totalFiles : '...'}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">cours</span>
            </div>
          </div>

          {/* Card 2: Rubriques */}
          <div className="bg-white dark:bg-cyber-card rounded-2xl p-4 border border-slate-200 dark:border-cyber-border hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-all cyber-card shadow-xs group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Rubriques IT</span>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-cyan-800 shadow-[0_6px_12px_-2px_rgba(6,182,212,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform">
                <FolderTree className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats ? stats.totalRubriques : '...'}
              </span>
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">domaines</span>
            </div>
          </div>

          {/* Card 3: Consultations en ligne */}
          <div className="bg-white dark:bg-cyber-card rounded-2xl p-4 border border-slate-200 dark:border-cyber-border hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all cyber-card shadow-xs group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Lectures en ligne</span>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 shadow-[0_6px_12px_-2px_rgba(16,185,129,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform">
                <Eye className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats ? (stats.totalViews ?? stats.totalDownloads ?? 0) : '...'}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">vues</span>
            </div>
          </div>

          {/* Card 4: Volume Stocké */}
          <div className="bg-white dark:bg-cyber-card rounded-2xl p-4 border border-slate-200 dark:border-cyber-border hover:border-purple-400 dark:hover:border-purple-500/40 transition-all cyber-card shadow-xs group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Volume IT</span>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 shadow-[0_6px_12px_-2px_rgba(168,85,247,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform">
                <HardDrive className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats ? formatSize(stats.totalSizeBytes) : '...'}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">documents</span>
            </div>
          </div>

          {/* Card 5: Compteur Visiteurs */}
          <div className="bg-white dark:bg-cyber-card rounded-2xl p-4 border border-slate-200 dark:border-cyber-border hover:border-amber-400 dark:hover:border-amber-500/40 transition-all cyber-card shadow-xs group col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Visiteurs Uniques</span>
              <div className="relative w-10 h-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-800 shadow-[0_6px_12px_-2px_rgba(245,158,11,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
              </div>
            </div>
            <div className="mt-2.5 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono text-amber-600 dark:text-amber-400">
                {visitorCount.toLocaleString('fr-FR')}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">visites</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
