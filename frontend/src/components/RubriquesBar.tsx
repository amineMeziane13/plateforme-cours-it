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
  const renderIcon = (iconName: string, color: string) => {
    const props = { className: "w-4 h-4" };
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
    <div className="py-6 border-b border-cyber-border/60 bg-cyber-darker/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyber-blueLight" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
              Filtre par Rubrique Académique
            </h2>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenRubriquesManager}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold text-slate-300 hover:text-white bg-cyber-card hover:bg-cyber-hover border border-cyber-border hover:border-cyber-blueLight transition-all"
            >
              <Settings2 className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Gérer les Rubriques</span>
            </button>
          )}
        </div>

        {/* Scrollable Pills */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
          
          {/* 'Toutes' Pill */}
          <button
            onClick={() => onSelectRubrique('all')}
            className={`flex-shrink-0 inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedRubriqueId === 'all'
                ? 'bg-blue-600 text-white shadow-glow-blue border border-blue-400/50'
                : 'bg-cyber-card/70 text-slate-300 hover:text-white hover:bg-cyber-hover border border-cyber-border'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Toutes les rubriques</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedRubriqueId === 'all' ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
            }`}>
              {totalFilesAll}
            </span>
          </button>

          {/* Individual Rubrique Pills */}
          {rubriques.map((rub) => {
            const isSelected = selectedRubriqueId === rub.id;
            const isRed = rub.color === 'red';
            const isCyan = rub.color === 'cyan';

            let activeClass = 'bg-blue-600 text-white shadow-glow-blue border-blue-400/50';
            let badgeBg = 'bg-blue-800 text-blue-100';

            if (isRed) {
              activeClass = 'bg-red-600 text-white shadow-glow-red border-red-400/50';
              badgeBg = 'bg-red-800 text-red-100';
            } else if (isCyan) {
              activeClass = 'bg-cyan-600 text-white shadow-glow-cyan border-cyan-400/50';
              badgeBg = 'bg-cyan-800 text-cyan-100';
            }

            return (
              <button
                key={rub.id}
                onClick={() => onSelectRubrique(rub.id)}
                className={`flex-shrink-0 inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? `${activeClass} border`
                    : 'bg-cyber-card/70 text-slate-300 hover:text-white hover:bg-cyber-hover border border-cyber-border hover:border-slate-700'
                }`}
              >
                <span className={isSelected ? 'text-white' : (isRed ? 'text-red-400' : isCyan ? 'text-cyan-400' : 'text-blue-400')}>
                  {renderIcon(rub.icon, rub.color)}
                </span>
                <span className="whitespace-nowrap">{rub.name}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected ? badgeBg : 'bg-slate-800 text-slate-400'
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
              className="flex-shrink-0 inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-950/30 hover:bg-blue-900/40 border border-dashed border-blue-500/40 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une rubrique</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
