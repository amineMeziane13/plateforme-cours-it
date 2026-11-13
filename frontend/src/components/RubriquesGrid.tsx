import React from 'react';
import { 
  Shield, 
  Code2, 
  Network, 
  Terminal, 
  Cloud, 
  Database, 
  Cpu, 
  Sparkles, 
  Folder,
  ArrowRight,
  BookOpen,
  Layers,
  Settings2,
  FolderTree
} from 'lucide-react';
import { Rubrique } from '../types';

interface RubriquesGridProps {
  rubriques: Rubrique[];
  onSelectRubrique: (rubriqueId: string) => void;
  isAdmin: boolean;
  onOpenRubriquesManager: () => void;
}

export const RubriquesGrid: React.FC<RubriquesGridProps> = ({
  rubriques,
  onSelectRubrique,
  isAdmin,
  onOpenRubriquesManager
}) => {
  // 3D-Style Medallion Icon Generator with Isometric Lighting & Depth
  const render3DIcon = (rubrique: Rubrique) => {
    const id = (rubrique.id || '').toLowerCase();
    const color = (rubrique.color || '').toLowerCase();
    const iconName = rubrique.icon || '';

    if (id.includes('securite') || color === 'red' || iconName === 'ShieldAlert') {
      return (
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 via-rose-600 to-red-800 shadow-[0_12px_24px_-4px_rgba(239,68,68,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-red-600/60 to-rose-400/30 backdrop-blur-xs flex items-center justify-center">
            <Shield className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400/80 blur-xs" />
        </div>
      );
    }

    if (id.includes('web') || color === 'blue' || iconName === 'Code2') {
      return (
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-800 shadow-[0_12px_24px_-4px_rgba(59,130,246,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
          <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-blue-600/60 to-cyan-400/30 backdrop-blur-xs flex items-center justify-center">
            <Code2 className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-300/80 blur-xs" />
        </div>
      );
    }

    if (id.includes('reseaux') || color === 'cyan' || iconName === 'Network') {
      return (
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 via-teal-500 to-cyan-800 shadow-[0_12px_24px_-4px_rgba(6,182,212,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-cyan-600/60 to-emerald-400/30 backdrop-blur-xs flex items-center justify-center">
            <Network className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-200/80 blur-xs" />
        </div>
      );
    }

    if (id.includes('linux') || iconName === 'Terminal') {
      return (
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-800 shadow-[0_12px_24px_-4px_rgba(245,158,11,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
          <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-amber-600/60 to-yellow-400/30 backdrop-blur-xs flex items-center justify-center">
            <Terminal className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-200/80 blur-xs" />
        </div>
      );
    }

    if (id.includes('cloud') || iconName === 'Cloud') {
      return (
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 shadow-[0_12px_24px_-4px_rgba(168,85,247,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-purple-600/60 to-pink-400/30 backdrop-blur-xs flex items-center justify-center">
            <Cloud className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-300/80 blur-xs" />
        </div>
      );
    }

    if (id.includes('bdd') || iconName === 'Database') {
      return (
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 shadow-[0_12px_24px_-4px_rgba(16,185,129,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-emerald-600/60 to-lime-400/30 backdrop-blur-xs flex items-center justify-center">
            <Database className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-200/80 blur-xs" />
        </div>
      );
    }

    if (id.includes('algo') || iconName === 'Cpu') {
      return (
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-600 to-violet-800 shadow-[0_12px_24px_-4px_rgba(139,92,246,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
          <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-violet-600/60 to-purple-400/30 backdrop-blur-xs flex items-center justify-center">
            <Cpu className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-violet-300/80 blur-xs" />
        </div>
      );
    }

    if (id.includes('ia') || iconName === 'Sparkles') {
      return (
        <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-fuchsia-500 via-rose-600 to-pink-800 shadow-[0_12px_24px_-4px_rgba(217,70,239,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-fuchsia-600/60 to-pink-400/30 backdrop-blur-xs flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-300/80 blur-xs" />
        </div>
      );
    }

    // Default 3D Medallion
    return (
      <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-800 shadow-[0_12px_24px_-4px_rgba(37,99,235,0.45),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 transition-all duration-300">
        <div className="absolute inset-1.5 rounded-2xl bg-gradient-to-tr from-blue-600/60 to-indigo-400/30 backdrop-blur-xs flex items-center justify-center">
          <Folder className="w-8 h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header of Rubriques Grid */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 dark:text-cyber-blueLight mb-2">
            <Layers className="w-5 h-5" />
            <span className="text-xs uppercase font-extrabold tracking-widest font-mono">
              Enseignement Supérieur & Recherche
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Rubriques & Domaines Informatiques
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Sélectionnez une thématique ci-dessous pour accéder aux cours interactifs, travaux dirigés et supports de travaux pratiques.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenRubriquesManager}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-cyber-card hover:bg-slate-50 dark:hover:bg-cyber-hover border border-slate-200 dark:border-cyber-border transition-all shadow-sm active:scale-95"
          >
            <Settings2 className="w-4 h-4 text-cyan-600 dark:text-cyber-cyan" />
            <span>Gérer les Rubriques</span>
          </button>
        )}
      </div>

      {/* Responsive Grid with 3D Medallions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {rubriques.map((rubrique) => {
          const count = rubrique.filesCount || 0;
          const subs = rubrique.sousRubriques || [];

          return (
            <div
              key={rubrique.id}
              onClick={() => onSelectRubrique(rubrique.id)}
              className="group relative bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border hover:border-blue-500/60 dark:hover:border-blue-400/50 rounded-3xl p-6 sm:p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                
                {/* Card Top: 3D Medallion Icon & Files Count Badge */}
                <div className="flex items-start justify-between mb-6">
                  {render3DIcon(rubrique)}
                  
                  <div className="flex flex-col items-end space-y-1">
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-500/30 shadow-xs">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{count} cours</span>
                    </span>
                    {subs.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {subs.length} sous-rubriques
                      </span>
                    )}
                  </div>
                </div>

                {/* Rubrique Title */}
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors mb-2.5">
                  {rubrique.name}
                </h3>

                {/* Rubrique Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {rubrique.description || "Consultez les supports de cours, polycopiés et travaux pratiques associés."}
                </p>

                {/* Sous-rubriques tags preview */}
                {subs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {subs.slice(0, 3).map(sub => (
                      <span 
                        key={sub.id}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono"
                      >
                        {sub.name}
                      </span>
                    ))}
                    {subs.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 font-mono">
                        +{subs.length - 3}
                      </span>
                    )}
                  </div>
                )}

              </div>

              {/* Card Footer Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-cyber-border/60 flex items-center justify-between text-xs font-bold">
                <span className="flex items-center space-x-2 text-blue-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform duration-200">
                  <span>Consulter en mode lecture</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                  {rubrique.badge || 'IT'}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};