import React from 'react';
import { 
  Folder, 
  Layers, 
  ShieldAlert, 
  Code2, 
  Network, 
  Terminal, 
  Cloud, 
  Database, 
  Cpu, 
  Sparkles, 
  Plus, 
  Settings2 
} from 'lucide-react';
import { Rubrique } from '../types';

interface RubriquesBarProps {
  rubriques: Rubrique[];
  selectedRubriqueId: string;
  onSelectRubrique: (id: string) => void;
  isAdmin: boolean;
  onOpenRubriquesManager: () => void;
}

export const RubriquesBar: React.FC<RubriquesBarProps> = ({
  rubriques,
  selectedRubriqueId,
  onSelectRubrique,
  isAdmin,
  onOpenRubriquesManager
}) => {
  // Dynamic icon helper
  const renderIcon = (iconName: string) => {
    const props = { className: "w-4 h-4 transition-transform group-hover:scale-110" };
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert {...props} />;
      case 'Code2':
        return <Code2 {...props} />;
      case 'Network':
        return <Network {...props} />;
      case 'Terminal':
        return <Terminal {...props} />;
      case 'Cloud':
        return <Cloud {...props} />;
      case 'Database':
        return <Database {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      default:
        return <Folder {...props} />;
    }
  };

  const totalFilesAll = rubriques.reduce((acc, r) => acc + (r.filesCount || 0), 0);

  return (
    <div className="py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
              Filtre par Rubrique Académique
            </h2>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenRubriquesManager}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-white bg-white dark:bg-slate-900 hover:bg-cyan-600 dark:hover:bg-cyan-600 border border-slate-200 dark:border-slate-800 transition-all shadow-xs hover:scale-105 active:scale-95"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Gérer les Rubriques</span>
            </button>
          )}
        </div>

        {/* Scrollable Animated Pills Container with Fade Indicators */}
        <div className="relative">
          
          <div className="flex items-center space-x-2.5 overflow-x-auto pb-1.5 pt-1 scrollbar-none scroll-smooth">
            
            {/* 'Toutes' Pill */}
            <button
              onClick={() => onSelectRubrique('all')}
              className={`group flex-shrink-0 inline-flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                selectedRubriqueId === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40'
                  : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Toutes les rubriques</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                selectedRubriqueId === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {totalFilesAll}
              </span>
            </button>

            {/* Individual Rubrique Pills */}
            {rubriques.map((rub) => {
              const isSelected = selectedRubriqueId === rub.id;
              const isRed = rub.color === 'red';
              const isCyan = rub.color === 'cyan';

              let activeGradient = 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border-blue-400/40';
              if (isRed) {
                activeGradient = 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 border-red-400/40';
              } else if (isCyan) {
                activeGradient = 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/25 border-cyan-400/40';
              }

              return (
                <button
                  key={rub.id}
                  onClick={() => onSelectRubrique(rub.id)}
                  className={`group flex-shrink-0 inline-flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isSelected
                      ? `${activeGradient} border`
                      : 'bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <span className={isSelected ? 'text-white' : (isRed ? 'text-red-500' : isCyan ? 'text-cyan-500' : 'text-blue-500')}>
                    {renderIcon(rub.icon)}
                  </span>
                  <span className="whitespace-nowrap">{rub.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {rub.filesCount || 0}
                  </span>
                </button>
              );
            })}

            {/* Quick Add Rubrique Button for Admin */}
            {isAdmin && (
              <button
                onClick={onOpenRubriquesManager}
                className="flex-shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-white bg-blue-50 dark:bg-cyan-950/40 hover:bg-blue-600 dark:hover:bg-cyan-600 border border-dashed border-blue-300 dark:border-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une rubrique</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};