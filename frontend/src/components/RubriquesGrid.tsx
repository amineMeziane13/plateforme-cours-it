import React from 'react';
import { 
  ShieldAlert, 
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
  Settings2
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
  // Helpers for large rubrique icons and gradients
  const getRubriqueVisuals = (rubrique: Rubrique) => {
    const iconName = rubrique.icon || '';
    const color = (rubrique.color || '').toLowerCase();

    // Icon component
    let IconComp = Folder;
    if (iconName === 'ShieldAlert' || color === 'red' || rubrique.id.includes('securite')) IconComp = ShieldAlert;
    else if (iconName === 'Code2' || color === 'blue' || rubrique.id.includes('web')) IconComp = Code2;
    else if (iconName === 'Network' || color === 'cyan' || rubrique.id.includes('reseaux')) IconComp = Network;
    else if (iconName === 'Terminal' || color === 'amber' || color === 'orange' || rubrique.id.includes('linux')) IconComp = Terminal;
    else if (iconName === 'Cloud' || color === 'purple' || color === 'indigo') IconComp = Cloud;
    else if (iconName === 'Database' || color === 'emerald' || color === 'green') IconComp = Database;
    else if (iconName === 'Cpu') IconComp = Cpu;
    else if (iconName === 'Sparkles') IconComp = Sparkles;

    // Color theme
    if (color === 'red' || rubrique.id.includes('securite')) {
      return {
        IconComp,
        iconBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30',
        cardBorder: 'hover:border-red-500/60 dark:hover:border-red-500/50',
        badgeBg: 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30',
        glow: 'group-hover:shadow-red-500/10',
        accentText: 'text-red-600 dark:text-red-400'
      };
    }
    if (color === 'cyan' || rubrique.id.includes('reseaux')) {
      return {
        IconComp,
        iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30',
        cardBorder: 'hover:border-cyan-500/60 dark:hover:border-cyan-500/50',
        badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30',
        glow: 'group-hover:shadow-cyan-500/10',
        accentText: 'text-cyan-600 dark:text-cyan-400'
      };
    }
    if (color === 'amber' || color === 'orange' || rubrique.id.includes('linux')) {
      return {
        IconComp,
        iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
        cardBorder: 'hover:border-amber-500/60 dark:hover:border-amber-500/50',
        badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
        glow: 'group-hover:shadow-amber-500/10',
        accentText: 'text-amber-600 dark:text-amber-400'
      };
    }
    if (color === 'emerald' || color === 'green') {
      return {
        IconComp,
        iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
        cardBorder: 'hover:border-emerald-500/60 dark:hover:border-emerald-500/50',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
        glow: 'group-hover:shadow-emerald-500/10',
        accentText: 'text-emerald-600 dark:text-emerald-400'
      };
    }
    if (color === 'purple' || color === 'indigo') {
      return {
        IconComp,
        iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
        cardBorder: 'hover:border-purple-500/60 dark:hover:border-purple-500/50',
        badgeBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30',
        glow: 'group-hover:shadow-purple-500/10',
        accentText: 'text-purple-600 dark:text-purple-400'
      };
    }

    // Default Blue
    return {
      IconComp,
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
      cardBorder: 'hover:border-blue-500/60 dark:hover:border-blue-500/50',
      badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30',
      glow: 'group-hover:shadow-blue-500/10',
      accentText: 'text-blue-600 dark:text-blue-400'
    };
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header of Rubriques Grid */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 dark:text-cyber-blueLight mb-1.5">
            <Layers className="w-5 h-5" />
            <span className="text-xs uppercase font-bold tracking-wider font-mono">
              Domaines & Spécialités Informatiques
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Rubriques Pédagogiques
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Cliquez sur un domaine pour explorer et télécharger l'ensemble des cours, travaux pratiques et supports associés.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={onOpenRubriquesManager}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-cyber-card hover:bg-slate-50 dark:hover:bg-cyber-hover border border-slate-200 dark:border-cyber-border transition-all shadow-sm"
          >
            <Settings2 className="w-4 h-4 text-cyan-600 dark:text-cyber-cyan" />
            <span>Gérer les Rubriques</span>
          </button>
        )}
      </div>

      {/* Grid of Large Rubriques Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rubriques.map((rubrique) => {
          const { IconComp, iconBg, cardBorder, badgeBg, glow, accentText } = getRubriqueVisuals(rubrique);
          const count = rubrique.filesCount || 0;

          return (
            <div
              key={rubrique.id}
              onClick={() => onSelectRubrique(rubrique.id)}
              className={`group relative bg-white dark:bg-cyber-card border border-slate-200 dark:border-cyber-border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${glow} ${cardBorder} flex flex-col justify-between`}
            >
              <div>
                
                {/* Card Top: Large Icon & Badge */}
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${iconBg} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                    <IconComp className="w-7 h-7" />
                  </div>
                  
                  <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeBg}`}>
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{count} {count > 1 ? 'cours' : 'cours'}</span>
                  </span>
                </div>

                {/* Rubrique Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono group-hover:text-blue-600 dark:group-hover:text-cyber-blueLight transition-colors mb-2">
                  {rubrique.name}
                </h3>

                {/* Rubrique Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6">
                  {rubrique.description || "Consultez les supports de cours, polycopiés de travaux dirigés et travaux pratiques."}
                </p>

              </div>

              {/* Card Footer Action */}
              <div className="pt-4 border-t border-slate-100 dark:border-cyber-border/60 flex items-center justify-between text-xs font-bold">
                <span className={`flex items-center space-x-1.5 ${accentText}`}>
                  <span>Accéder aux cours</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                </span>
                <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
                  {rubrique.badge || 'Fichiers & TP'}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};