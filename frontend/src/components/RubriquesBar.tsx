import React, { useRef, useState, useEffect } from 'react';
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
  Settings2,
  ChevronLeft,
  ChevronRight,
  Compass
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Dynamic icon helper with glowing aesthetic
  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    const props = { className };
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

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [rubriques]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  const totalFilesAll = rubriques.reduce((acc, r) => acc + (r.filesCount || 0), 0);

  return (
    <nav 
      aria-label="Navigation des Rubriques"
      className="relative py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl transition-colors duration-300 z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-indigo-500/20 border border-blue-500/30 text-blue-600 dark:text-cyan-400 shadow-xs">
              <Compass className="w-4 h-4 animate-spin-slow" />
              <div className="absolute inset-0 rounded-xl bg-cyan-400/20 blur-xs -z-10" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>Parcours & Rubriques d'Enseignement</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                  {rubriques.length} modules
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Scroll Navigation Arrows */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-100/80 dark:bg-slate-900/80 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Faire défiler vers la gauche"
                className={`p-1.5 rounded-lg transition-all ${
                  canScrollLeft 
                    ? 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 shadow-xs cursor-pointer' 
                    : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Faire défiler vers la droite"
                className={`p-1.5 rounded-lg transition-all ${
                  canScrollRight 
                    ? 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 shadow-xs cursor-pointer' 
                    : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isAdmin && (
              <button
                onClick={onOpenRubriquesManager}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-white bg-white dark:bg-slate-900 hover:bg-cyan-600 dark:hover:bg-cyan-600 border border-slate-200 dark:border-slate-800 transition-all shadow-xs hover:scale-[1.03] active:scale-95"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gérer les Rubriques</span>
                <span className="sm:hidden">Gérer</span>
              </button>
            )}
          </div>
        </div>

        {/* Modern Interactive Scrollable Carousel */}
        <div className="relative group/carousel">
          
          {/* Subtle Left & Right Shadow Fade Overlays */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none transition-opacity duration-300" />
          )}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none transition-opacity duration-300" />
          )}

          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex items-center space-x-2.5 overflow-x-auto py-1 scrollbar-none scroll-smooth"
          >
            
            {/* 'Toutes les rubriques' Master Button */}
            <button
              onClick={() => onSelectRubrique('all')}
              className={`group relative flex-shrink-0 inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
                selectedRubriqueId === 'all'
                  ? 'bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-cyan-400/40 ring-2 ring-cyan-500/20'
                  : 'bg-white/80 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                selectedRubriqueId === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 group-hover:scale-110'
              }`}>
                <Layers className="w-3.5 h-3.5" />
              </div>

              <div className="flex flex-col text-left">
                <span className="tracking-wide">Toutes les rubriques</span>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
                selectedRubriqueId === 'all' 
                  ? 'bg-white/25 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
              }`}>
                {totalFilesAll}
              </span>

              {/* Glowing Bottom Line when Active */}
              {selectedRubriqueId === 'all' && (
                <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[0.5px]" />
              )}
            </button>

            {/* Individual Modern Rubrique Buttons */}
            {rubriques.map((rub) => {
              const isSelected = selectedRubriqueId === rub.id;
              const isRed = rub.color === 'red';
              const isCyan = rub.color === 'cyan';

              // Dynamic theme styles
              let activeGradient = 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 border-blue-400/40 ring-2 ring-blue-500/20';
              let iconTheme = 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400';
              let glowColor = 'via-blue-300';

              if (isRed) {
                activeGradient = 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg shadow-red-500/25 border-red-400/40 ring-2 ring-red-500/20';
                iconTheme = 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400';
                glowColor = 'via-rose-300';
              } else if (isCyan) {
                activeGradient = 'bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 text-white shadow-lg shadow-cyan-500/25 border-cyan-400/40 ring-2 ring-cyan-500/20';
                iconTheme = 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400';
                glowColor = 'via-cyan-300';
              }

              return (
                <button
                  key={rub.id}
                  onClick={() => onSelectRubrique(rub.id)}
                  className={`group relative flex-shrink-0 inline-flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 hover:scale-[1.03] active:scale-95 ${
                    isSelected
                      ? `${activeGradient} border`
                      : 'bg-white/80 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-xs'
                  }`}
                >
                  {/* Category Medallion Icon */}
                  <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                    isSelected ? 'bg-white/20 text-white' : `${iconTheme} group-hover:scale-110`
                  }`}>
                    {renderIcon(rub.icon, "w-3.5 h-3.5")}
                  </div>

                  {/* Rubrique Name */}
                  <span className="whitespace-nowrap tracking-wide">{rub.name}</span>

                  {/* Files Counter */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-colors ${
                    isSelected 
                      ? 'bg-white/25 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
                  }`}>
                    {rub.filesCount || 0}
                  </span>

                  {/* Laser Glow Underline for Selected Category */}
                  {isSelected && (
                    <div className={`absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent ${glowColor} to-transparent blur-[0.5px]`} />
                  )}
                </button>
              );
            })}

            {/* Quick Add Rubrique Button for Admin */}
            {isAdmin && (
              <button
                onClick={onOpenRubriquesManager}
                className="flex-shrink-0 inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-white bg-blue-50/70 dark:bg-cyan-950/40 hover:bg-blue-600 dark:hover:bg-cyan-600 border border-dashed border-blue-300 dark:border-cyan-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Nouvelle rubrique</span>
              </button>
            )}

          </div>

        </div>

      </div>
    </nav>
  );
};
