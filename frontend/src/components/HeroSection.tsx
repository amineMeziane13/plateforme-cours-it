import React from 'react';
import { 
  FileText, 
  FolderTree, 
  DownloadCloud, 
  HardDrive, 
  Search, 
  X, 
  Sparkles
} from 'lucide-react';
import { PlatformStats } from '../types';

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

  return (
    <div className="relative pt-6 sm:pt-10 pb-10 overflow-hidden border-b border-slate-200 dark:border-cyber-border/40 bg-gradient-to-b from-white via-slate-50 to-slate-50 dark:from-cyber-black dark:via-cyber-black dark:to-cyber-darker transition-colors">
      
      {/* Background Soft Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-10 right-1/4 w-80 h-80 bg-red-500/5 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-cyber-blueLight text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-pulse"></span>
            <span>PORTAIL OFFICIEL DES COURS & TRAVAUX PRATIQUES IT</span>
          </div>

          {isAdmin && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/40 text-red-600 dark:text-red-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span>Privilèges Administrateur Actifs</span>
            </div>
          )}
        </div>

        {/* Main Title & Subtitle */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight font-sans">
            Centre de Ressources{' '}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-red-500 bg-clip-text text-transparent">
              Informatiques & Télécoms
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            Consultez, téléchargez et déposez l'ensemble des cours magistraux, travaux dirigés, travaux pratiques et archives de code pour vos modules de formation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mb-8">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-blue-500" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher un cours (ex: Réseaux, Docker, Python, L3, M1)..."
              className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-cyber-card/90 border border-slate-300 dark:border-cyber-border focus:border-blue-500 dark:focus:border-cyber-blueLight focus:ring-2 focus:ring-blue-500/20 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-sm transition-all shadow-sm outline-none"
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

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Fichiers & Documents */}
          <div className="bg-white dark:bg-cyber-card rounded-xl p-4 border border-slate-200 dark:border-cyber-border hover:border-blue-400 dark:hover:border-blue-500/40 transition-all cyber-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Fichiers</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats ? stats.totalFiles : '...'}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">supports</span>
            </div>
          </div>

          {/* Card 2: Rubriques */}
          <div className="bg-white dark:bg-cyber-card rounded-xl p-4 border border-slate-200 dark:border-cyber-border hover:border-cyan-400 dark:hover:border-cyan-500/40 transition-all cyber-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Rubriques IT</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <FolderTree className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats ? stats.totalRubriques : '...'}
              </span>
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">domaines</span>
            </div>
          </div>

          {/* Card 3: Téléchargements (Red accent) */}
          <div className="bg-white dark:bg-cyber-card rounded-xl p-4 border border-slate-200 dark:border-cyber-border hover:border-red-400 dark:hover:border-red-500/40 transition-all cyber-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Téléchargements</span>
              <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
                <DownloadCloud className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats ? stats.totalDownloads : '...'}
              </span>
              <span className="text-xs text-red-600 dark:text-red-400 font-medium">réalisés</span>
            </div>
          </div>

          {/* Card 4: Volume Stocké */}
          <div className="bg-white dark:bg-cyber-card rounded-xl p-4 border border-slate-200 dark:border-cyber-border hover:border-indigo-400 dark:hover:border-blue-500/40 transition-all cyber-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Volume Stocké</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats ? formatSize(stats.totalSizeBytes) : '...'}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">disponibles</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
