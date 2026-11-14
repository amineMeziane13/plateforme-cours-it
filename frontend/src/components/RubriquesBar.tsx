import React, { useState } from 'react';
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
  BookOpen,
  Bookmark,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Rubrique } from '../types';

interface RubriquesBarProps {
  rubriques: Rubrique[];
  selectedRubriqueId: string;
  onSelectRubrique: (id: string) => void;
  isAdmin: boolean;
  onOpenRubriquesManager: () => void;
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export const RubriquesBar: React.FC<RubriquesBarProps> = ({
  rubriques,
  selectedRubriqueId,
  onSelectRubrique,
  isAdmin,
  onOpenRubriquesManager
}) => {
  const [isFlipping, setIsFlipping] = useState(false);

  // Dynamic icon helper
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

  const totalFilesAll = rubriques.reduce((acc, r) => acc + (r.filesCount || 0), 0);

  const handleSelectWithFlip = (id: string) => {
    setIsFlipping(true);
    onSelectRubrique(id);
    setTimeout(() => setIsFlipping(false), 500);
  };

  const selectedRub = rubriques.find(r => r.id === selectedRubriqueId);

  return (
    <section className="py-6 sm:py-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-100/90 via-slate-50/60 to-white dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Admin Management Trigger */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider font-mono text-slate-800 dark:text-slate-200">
              Livre des Enseignements • Menu Pédagogique 3D
            </span>
          </div>

          {isAdmin && (
            <button
              onClick={onOpenRubriquesManager}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-white bg-white dark:bg-slate-900 hover:bg-cyan-600 dark:hover:bg-cyan-600 border border-slate-200 dark:border-slate-800 transition-all shadow-xs active:scale-95"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Gérer les Chapitres</span>
            </button>
          )}
        </div>

        {/* 3D Book Container */}
        <div 
          className="relative w-full max-w-5xl mx-auto py-2"
          style={{ perspective: '1400px' }}
        >
          
          {/* 3D Physical Book Structure */}
          <div 
            className={`relative rounded-3xl transition-transform duration-500 ease-out shadow-2xl ${
              isFlipping ? 'scale-[0.99] rotate-x-1' : 'hover:scale-[1.005]'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(4deg)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 0 30px rgba(6, 182, 212, 0.1)'
            }}
          >
            
            {/* Leather Hardcover Binding Base (Fond de reliure en cuir avec dorure) */}
            <div className="absolute -inset-2.5 sm:-inset-3.5 rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-2 border-amber-600/40 shadow-2xl pointer-events-none" />

            {/* Book Corner Protectors (Coins métalliques dorés) */}
            <div className="absolute -top-2 -left-2 w-7 h-7 border-t-2 border-l-2 border-amber-400 rounded-tl-xl pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-7 h-7 border-t-2 border-r-2 border-amber-400 rounded-tr-xl pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-7 h-7 border-b-2 border-l-2 border-amber-400 rounded-bl-xl pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-7 h-7 border-b-2 border-r-2 border-amber-400 rounded-br-xl pointer-events-none" />

            {/* 3D Top Indexed Bookmark Ribbons (Onglets signets intercalaires en haut) */}
            <div className="absolute -top-4 sm:-top-5 inset-x-8 sm:inset-x-16 flex items-center justify-between z-20 pointer-events-auto overflow-x-auto scrollbar-none py-1">
              <button
                onClick={() => handleSelectWithFlip('all')}
                className={`flex-shrink-0 px-2.5 sm:px-3 py-1 rounded-t-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all shadow-md transform hover:-translate-y-1 ${
                  selectedRubriqueId === 'all'
                    ? 'bg-amber-500 text-slate-950 -translate-y-1.5 shadow-amber-500/40'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ★ Sommaire
              </button>

              {rubriques.map((rub, idx) => {
                const isSelected = selectedRubriqueId === rub.id;
                const isRed = rub.color === 'red';
                const isCyan = rub.color === 'cyan';
                const tabColor = isRed ? 'bg-red-600 text-white' : isCyan ? 'bg-cyan-600 text-white' : 'bg-blue-600 text-white';

                return (
                  <button
                    key={rub.id}
                    onClick={() => handleSelectWithFlip(rub.id)}
                    className={`flex-shrink-0 px-2 sm:px-2.5 py-1 rounded-t-lg font-mono text-[9px] sm:text-[10px] font-bold uppercase transition-all shadow-md transform hover:-translate-y-1 mx-0.5 ${
                      isSelected
                        ? `${tabColor} -translate-y-1.5 shadow-lg`
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
                    }`}
                    title={rub.name}
                  >
                    Ch.{ROMAN_NUMERALS[idx] || idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Central Spine Golden Bookmark Ribbon (Ruban marque-page satin doré) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-full z-30 pointer-events-none flex flex-col items-center">
              <div className="w-2.5 sm:w-3.5 h-full bg-gradient-to-b from-amber-400 via-amber-300 to-amber-500 shadow-lg shadow-amber-500/30" />
              <div className="w-0 h-0 border-l-[6px] sm:border-l-[8px] border-l-transparent border-r-[6px] sm:border-r-[8px] border-r-transparent border-t-[8px] sm:border-t-[10px] border-t-amber-500" />
            </div>

            {/* Two-Page Open Book Spread (Pages ouvertes du livre) */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 rounded-2xl sm:rounded-3xl overflow-hidden bg-amber-50/95 dark:bg-[#0c1220] border border-amber-900/30 dark:border-cyan-500/30">
              
              {/* Central Crease Shadow (Ombre du pli central de reliure) */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/15 via-black/25 to-black/15 pointer-events-none z-10" />

              {/* ========================================================================= */}
              {/* PAGE DE GAUCHE : IDENTITÉ ACADÉMIQUE & VUE GLOBALE                         */}
              {/* ========================================================================= */}
              <div className="p-5 sm:p-7 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-amber-900/15 dark:border-slate-800/80 relative">
                
                {/* Vintage Gilded Double Border inside left page */}
                <div className="absolute inset-3 border border-amber-600/20 dark:border-cyan-500/10 rounded-xl pointer-events-none" />

                <div>
                  
                  {/* Academic Insignia & Seal Header */}
                  <div className="text-center pb-4 border-b border-amber-900/15 dark:border-slate-800">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md mb-2">
                      <GraduationCap className="w-6 h-6 text-amber-100" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                      Enseignement Supérieur • ESE ORAN
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-black text-slate-900 dark:text-amber-100 tracking-tight mt-0.5">
                      IT ACADEMY
                    </h3>
                    <p className="text-[11px] font-serif italic text-slate-600 dark:text-slate-400">
                      Syllabus & Recueil Officiel — Dr. M.A. Meziane
                    </p>
                  </div>

                  {/* Summary Overview Button */}
                  <div className="mt-5">
                    <button
                      onClick={() => handleSelectWithFlip('all')}
                      className={`w-full group p-3.5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between ${
                        selectedRubriqueId === 'all'
                          ? 'bg-amber-100/90 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-200 shadow-md ring-2 ring-amber-400/40'
                          : 'bg-white/80 dark:bg-slate-900/60 border-amber-900/15 dark:border-slate-800 hover:bg-amber-100/50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-serif font-black text-sm shadow-xs">
                          ★
                        </div>
                        <div>
                          <div className="font-serif font-bold text-xs sm:text-sm">
                            Volume Intégral (Tous les chapitres)
                          </div>
                          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                            {totalFilesAll} cours, fiches et TPs référencés
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${selectedRubriqueId === 'all' ? 'text-amber-600' : 'text-slate-400'}`} />
                    </button>
                  </div>

                  {/* Active Chapter Details Note if a specific chapter is open */}
                  {selectedRub && selectedRubriqueId !== 'all' && (
                    <div className="mt-4 p-3.5 rounded-xl bg-blue-50/80 dark:bg-slate-900/80 border border-blue-200 dark:border-cyan-500/30 text-xs">
                      <div className="flex items-center space-x-2 text-blue-700 dark:text-cyan-400 font-bold font-serif mb-1">
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                        <span>Chapitre actuellement ouvert :</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {selectedRub.name}
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {selectedRub.description}
                      </p>
                    </div>
                  )}

                </div>

                {/* Left Page Footer */}
                <div className="pt-4 border-t border-amber-900/15 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Volume I • Année Universitaire 2026</span>
                  <span className="font-serif italic font-bold">Page 1</span>
                </div>

              </div>

              {/* ========================================================================= */}
              {/* PAGE DE DROITE : INDEX DES CHAPITRES (TABLE DES MATIÈRES INTERACTIVE)     */}
              {/* ========================================================================= */}
              <div className="p-5 sm:p-7 md:p-8 flex flex-col justify-between relative bg-gradient-to-bl from-amber-50/50 via-white/40 to-transparent dark:from-slate-950 dark:via-slate-900/40 dark:to-transparent">
                
                {/* Vintage Gilded Double Border inside right page */}
                <div className="absolute inset-3 border border-amber-600/20 dark:border-cyan-500/10 rounded-xl pointer-events-none" />

                <div>
                  
                  {/* Right Page Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-amber-900/15 dark:border-slate-800 mb-3">
                    <span className="text-xs font-serif font-black uppercase tracking-wider text-slate-900 dark:text-amber-200">
                      Table des Matières
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      Sélectionnez un chapitre ci-dessous
                    </span>
                  </div>

                  {/* Chapters List (Rubriques) */}
                  <div className="space-y-1.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-none">
                    {rubriques.map((rub, index) => {
                      const isSelected = selectedRubriqueId === rub.id;
                      const roman = ROMAN_NUMERALS[index] || (index + 1).toString();
                      const isRed = rub.color === 'red';
                      const isCyan = rub.color === 'cyan';

                      return (
                        <button
                          key={rub.id}
                          onClick={() => handleSelectWithFlip(rub.id)}
                          className={`w-full group px-3 py-2 rounded-xl text-left transition-all duration-200 flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md font-bold'
                              : 'hover:bg-amber-100/70 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            
                            {/* Chapter Roman Numeral Badge */}
                            <span className={`w-6 h-6 rounded-md font-serif text-[10px] font-black flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-amber-200/60 dark:bg-slate-800 text-amber-900 dark:text-amber-300'
                            }`}>
                              {roman}
                            </span>

                            {/* Icon & Chapter Name */}
                            <span className={`shrink-0 ${isSelected ? 'text-white' : (isRed ? 'text-red-500' : isCyan ? 'text-cyan-500' : 'text-blue-500')}`}>
                              {renderIcon(rub.icon, "w-3.5 h-3.5")}
                            </span>

                            <span className="text-xs truncate font-serif">
                              {rub.name}
                            </span>
                          </div>

                          {/* File Counter Pill */}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono shrink-0 ml-2 ${
                            isSelected
                              ? 'bg-white/25 text-white'
                              : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                          }`}>
                            {rub.filesCount || 0}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                </div>

                {/* Right Page Footer */}
                <div className="pt-4 border-t border-amber-900/15 dark:border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-4">
                  <span>Faculté d'Informatique • Oran</span>
                  <span className="font-serif italic font-bold">Page 2</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};