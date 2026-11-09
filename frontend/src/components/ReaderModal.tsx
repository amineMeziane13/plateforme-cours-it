import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldAlert, 
  Sun, 
  Moon, 
  BookOpen, 
  EyeOff, 
  Lock,
  Type,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Eye,
  Scan,
  Shield
} from 'lucide-react';
import { CourseFile } from '../types';

interface ReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: CourseFile | null;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  isOpen,
  onClose,
  file
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'text' | 'pdf' | 'image' | 'other'>('text');
  
  // Reader controls state
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState(15);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [screenshotWarning, setScreenshotWarning] = useState(false);

  // Mobile Anti-Capture Spotlight / Viseur Sécurisé
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeMode, setActiveMode] = useState<'spotlight' | 'standard'>('spotlight');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const BLOCK_SIZE = 7; // Number of lines visible at once in spotlight mode

  // Live second-by-second timestamp
  const [realTime, setRealTime] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Clear clipboard with protection notice
  const wipeClipboard = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(
          'DOCUMENT PROTÉGÉ — DR. M.A. MEZIANE (ESE ORAN) — COPIE ET CAPTURE STRICTEMENT INTERDITES'
        ).catch(() => {});
      }
    } catch (_) {}
  };

  // Detect touch-capable devices on mount (smartphones and tablets)
  useEffect(() => {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.innerWidth < 768;
    setIsTouchDevice(isTouch);
    // On mobile, default to spotlight mode to make full screenshot impossible
    if (isTouch) {
      setActiveMode('spotlight');
    }
  }, []);

  // Live second-by-second forensic watermark timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setRealTime(now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch document preview when file opens
  useEffect(() => {
    if (!isOpen || !file) {
      setContent(null);
      setError(null);
      setLoading(true);
      setIsWindowBlurred(false);
      setScreenshotWarning(false);
      setCurrentBlockIndex(0);
      return;
    }

    setLoading(true);
    setError(null);
    setIsWindowBlurred(false);
    setCurrentBlockIndex(0);

    // Call server with ?format=json to inspect true content on disk
    fetch(`/api/files/${file.id}/preview?format=json`, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Impossible de charger le contenu de ce cours.');
        }
        const data = await res.json();
        const detectedType = data.type || 'text';
        setFileType(detectedType);

        if (detectedType === 'text') {
          setContent(data.content || '');
        } else if (detectedType === 'pdf') {
          setContent(data.dataUrl || `/api/files/${file.id}/preview`);
        } else if (detectedType === 'image') {
          setContent(data.dataUrl || `/api/files/${file.id}/preview`);
        } else {
          setContent(data.content || '');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Erreur lors du chargement.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, file]);

  // Comprehensive Anti-Screenshot and Anti-Capture Security Listeners
  useEffect(() => {
    if (!isOpen) return;

    // 1. Window Blur: fires when snipping tools, start menu, or other apps take focus
    const handleBlur = () => {
      setIsWindowBlurred(true);
      wipeClipboard();
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    // 2. Tab switch or document hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
        wipeClipboard();
      } else {
        setIsWindowBlurred(false);
      }
    };

    // 3. Mouse leave window: cursor moving towards desktop / taskbar / screenshot tool
    const handleMouseLeave = () => {
      setIsWindowBlurred(true);
    };

    const handleMouseEnter = () => {
      setIsWindowBlurred(false);
    };

    // 4. Multi-finger touch interception (prevents multi-finger screenshot gestures)
    const handleTouchStartGlobal = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        setIsWindowBlurred(true);
        setScreenshotWarning(true);
        wipeClipboard();
      }
    };

    // 5. Intercept all capture & copy keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const isPrintScreen = e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44;
      const isMetaKey = e.key === 'Meta' || e.code === 'MetaLeft' || e.code === 'MetaRight';
      const isAltKey = e.key === 'Alt' || e.code === 'AltLeft' || e.code === 'AltRight';
      
      // Ctrl+P (Print), Ctrl+S (Save), Ctrl+C (Copy), Ctrl+U (Source), F12 (Inspect)
      const isCtrlShortcut = (e.ctrlKey || e.metaKey) && ['p', 's', 'c', 'u', 'x', 'a'].includes(e.key.toLowerCase());
      const isDevTools = e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()));
      const isSnippingTool = (e.shiftKey && (e.metaKey || (e.ctrlKey && e.altKey)));

      if (isPrintScreen || isMetaKey || isAltKey || isCtrlShortcut || isDevTools || isSnippingTool) {
        e.preventDefault();
        e.stopPropagation();
        wipeClipboard();
        setIsWindowBlurred(true);
        setScreenshotWarning(true);
        setTimeout(() => setScreenshotWarning(false), 3500);
      }
    };

    // 6. Block Context Menu (right click and long-press)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // 7. Block Copy / Cut / Drag
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      wipeClipboard();
      setScreenshotWarning(true);
      setTimeout(() => setScreenshotWarning(false), 3000);
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('touchstart', handleTouchStartGlobal, { passive: false });
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('contextmenu', handleContextMenu, true);
    window.addEventListener('copy', handleCopy, true);
    window.addEventListener('cut', handleCopy, true);
    window.addEventListener('dragstart', (e) => e.preventDefault(), true);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('touchstart', handleTouchStartGlobal);
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('contextmenu', handleContextMenu, true);
      window.removeEventListener('copy', handleCopy, true);
      window.removeEventListener('cut', handleCopy, true);
    };
  }, [isOpen]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen || !file) return null;

  // Split lines for text content
  const allLines = content ? content.split('\n') : [];
  const totalBlocks = Math.max(1, Math.ceil(allLines.length / BLOCK_SIZE));
  const visibleLines = activeMode === 'spotlight' 
    ? allLines.slice(currentBlockIndex * BLOCK_SIZE, (currentBlockIndex + 1) * BLOCK_SIZE)
    : allLines;
  const startLineNumber = activeMode === 'spotlight' ? currentBlockIndex * BLOCK_SIZE + 1 : 1;

  // Theme-dependent styles
  const themeClasses = {
    light: 'bg-white text-slate-800 border-slate-200',
    sepia: 'bg-[#FBF0D9] text-[#433422] border-[#E8D7B8]',
    dark: 'bg-[#0F172A] text-slate-100 border-slate-800'
  }[readerTheme];

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in select-none"
      onContextMenu={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
    >
      {/* Strict print disabling style */}
      <style>{`
        @media print {
          body, #root, .reader-modal-shield {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      <div 
        ref={containerRef}
        className={`reader-modal-shield relative w-full max-w-6xl h-[96vh] sm:h-[94vh] rounded-2xl flex flex-col shadow-2xl border overflow-hidden transition-colors ${themeClasses}`}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
      >
        
        {/* Top Control Bar */}
        <header className="flex flex-wrap items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 border-b border-inherit bg-black/5 dark:bg-white/5 gap-2 sm:gap-3">
          
          {/* Document Title & Badges */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                  Mode Protégé Anti-Capture
                </span>
                <span className="text-xs opacity-40">•</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Bouclier Actif</span>
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-bold truncate max-w-[180px] sm:max-w-md lg:max-w-xl">
                {file.title}
              </h2>
            </div>
          </div>

          {/* Reader Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs">
            
            {/* Spotlight / Viseur Mode Toggle */}
            <button
              onClick={() => setActiveMode(prev => prev === 'spotlight' ? 'standard' : 'spotlight')}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                activeMode === 'spotlight' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-xs' 
                  : 'bg-black/5 dark:bg-white/10 border-inherit text-slate-600 dark:text-slate-300'
              }`}
              title="Activer/Désactiver le Viseur Sécurisé Anti-Capture (affiche par section pour empêcher la capture intégrale du cours)"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>{activeMode === 'spotlight' ? 'Viseur Anti-Capture' : 'Vue Déroulante'}</span>
            </button>

            {/* Visual Themes Switcher */}
            <div className="flex items-center space-x-1 px-1.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 border border-inherit">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded-md ${readerTheme === 'light' ? 'bg-white shadow-xs text-slate-900' : 'opacity-60'}`}
                title="Thème Clair"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-1.5 rounded-md ${readerTheme === 'sepia' ? 'bg-[#F2E5C8] shadow-xs text-[#5F4B32]' : 'opacity-60'}`}
                title="Thème Sépia"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded-md ${readerTheme === 'dark' ? 'bg-slate-800 shadow-xs text-white' : 'opacity-60'}`}
                title="Thème Sombre"
              >
                <Moon className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 border border-inherit hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              title={isFullscreen ? "Quitter le plein écran" : "Mode plein écran"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              title="Fermer la lecture"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </header>

        {/* Security Warning Notification */}
        {screenshotWarning && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce border border-white/20">
            <ShieldAlert className="w-4 h-4" />
            <span>Capture d'écran neutralisée • Dr. M.A. Meziane (ESE ORAN)</span>
          </div>
        )}

        {/* Reading Content Area with Watermark Layer */}
        <div className="relative flex-1 overflow-auto p-3 sm:p-8 select-none flex flex-col justify-between">
          
          {/* HIGH-DENSITY DYNAMIC FORENSIC WATERMARK OVERLAY WITH REAL-TIME CLOCK */}
          <div 
            className="pointer-events-none absolute inset-0 z-10 flex flex-wrap items-center justify-around opacity-[0.11] dark:opacity-[0.10] overflow-hidden select-none"
            aria-hidden="true"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="text-xs sm:text-sm font-black uppercase font-mono tracking-widest rotate-[-30deg] p-5 whitespace-nowrap text-red-600 dark:text-cyan-400 select-none"
              >
                DR. M.A. MEZIANE • ESE ORAN • COPIE INTERDITE • {currentDate} {realTime}
              </div>
            ))}
          </div>

          {/* Desktop/System Blur Shield (Perte de focus / Outil capture externe) */}
          {isWindowBlurred && (
            <div 
              onClick={() => setIsWindowBlurred(false)}
              className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center text-center p-6 text-white cursor-pointer select-none"
            >
              <div className="p-4 rounded-full bg-red-600/20 border border-red-500/50 mb-4 animate-pulse">
                <EyeOff className="w-10 h-10 text-red-400" />
              </div>
              <h4 className="text-lg font-bold font-mono text-white mb-2">
                Affichage Masqué pour Protection Pédagogique
              </h4>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed mb-4">
                Pour empêcher toute capture d'écran, le document est immédiatement flouté dès la perte de focus de la fenêtre.
              </p>
              <button 
                onClick={() => setIsWindowBlurred(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
              >
                Reprendre la lecture
              </button>
            </div>
          )}

          {/* Main Reading Container */}
          <div 
            style={{ 
              transform: `scale(${zoom / 100})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full flex-1 flex flex-col items-center justify-center select-none"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Chargement optimisé et sécurisation du document...</span>
              </div>
            ) : error ? (
              <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs text-center max-w-md">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="font-bold mb-1">Impossible de charger le document</div>
                <div>{error}</div>
              </div>
            ) : fileType === 'pdf' ? (
              /* PDF Viewer with Aperture Slit Protection on mobile */
              <div className="w-full max-w-4xl h-[72vh] rounded-xl overflow-hidden shadow-lg border border-inherit bg-slate-100 dark:bg-slate-900 relative">
                {activeMode === 'spotlight' && (
                  <>
                    <div className="absolute top-0 inset-x-0 h-1/4 bg-slate-950/90 backdrop-blur-xl z-20 flex items-center justify-center text-[11px] font-mono font-bold text-slate-400 border-b border-white/10 pointer-events-none">
                      🛡️ ZONE SUPÉRIEURE PROTÉGÉE — DR. M.A. MEZIANE (ESE ORAN)
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-1/4 bg-slate-950/90 backdrop-blur-xl z-20 flex items-center justify-center text-[11px] font-mono font-bold text-slate-400 border-t border-white/10 pointer-events-none">
                      🛡️ ZONE INFÉRIEURE PROTÉGÉE — DR. M.A. MEZIANE (ESE ORAN)
                    </div>
                  </>
                )}
                <iframe
                  src={`${content}#toolbar=0&navpanes=0&scrollbar=1&statusbar=0&messages=0`}
                  className="w-full h-full border-none pointer-events-auto"
                  title={file.title}
                />
              </div>
            ) : fileType === 'image' ? (
              /* Image Viewer with disabled drag and context menu */
              <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border border-inherit relative">
                <img 
                  src={content || ''} 
                  alt={file.title}
                  className="w-full h-auto object-contain pointer-events-none select-none"
                  draggable={false}
                />
              </div>
            ) : (
              /* High-Security Text / Code Reader with Spotlight Aperture */
              <div className="w-full max-w-3xl flex flex-col select-none">
                
                {/* Meta Header */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-inherit text-xs opacity-75 font-sans">
                  <span>Support : <strong>{file.title}</strong></span>
                  <span className="font-mono text-[11px]">
                    {activeMode === 'spotlight' 
                      ? `Section ${currentBlockIndex + 1} sur ${totalBlocks} (${allLines.length} lignes)`
                      : `${allLines.length} lignes`
                    }
                  </span>
                </div>

                {/* If Spotlight Mode Active: Top Masking Shield */}
                {activeMode === 'spotlight' && currentBlockIndex > 0 && (
                  <div className="w-full py-2.5 px-4 mb-3 rounded-xl bg-slate-900/80 text-slate-400 border border-slate-700/60 text-[11px] font-mono flex items-center justify-between shadow-xs select-none">
                    <span className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{currentBlockIndex * BLOCK_SIZE} lignes précédentes masquées (Anti-Capture)</span>
                    </span>
                    <button
                      onClick={() => setCurrentBlockIndex(prev => Math.max(0, prev - 1))}
                      className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 text-[10px]"
                    >
                      ▲ Précédent
                    </button>
                  </div>
                )}

                {/* Visible Lines Container (Sharp & Crystal Clear) */}
                <div 
                  className={`w-full rounded-2xl p-4 sm:p-6 font-mono shadow-sm border border-inherit overflow-x-auto leading-relaxed select-none ${
                    activeMode === 'spotlight' ? 'ring-2 ring-blue-500/30' : ''
                  }`}
                  style={{ fontSize: `${fontSize}px`, userSelect: 'none', WebkitUserSelect: 'none' }}
                >
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono select-none">
                    {visibleLines.length > 0 ? (
                      visibleLines.map((line, idx) => {
                        const lineNum = startLineNumber + idx;
                        return (
                          <div key={idx} className="flex space-x-3 sm:space-x-4 hover:bg-black/5 dark:hover:bg-white/5 px-1 sm:px-2 py-0.5 rounded">
                            <span className="w-6 sm:w-8 text-right opacity-30 select-none text-[10px] sm:text-[11px] font-mono flex-shrink-0">
                              {lineNum}
                            </span>
                            <span className="flex-1 font-mono text-xs sm:text-sm">{line || ' '}</span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="opacity-50">Document vide ou inaccessible.</span>
                    )}
                  </pre>
                </div>

                {/* If Spotlight Mode Active: Bottom Masking Shield */}
                {activeMode === 'spotlight' && currentBlockIndex < totalBlocks - 1 && (
                  <div className="w-full py-2.5 px-4 mt-3 rounded-xl bg-slate-900/80 text-slate-400 border border-slate-700/60 text-[11px] font-mono flex items-center justify-between shadow-xs select-none">
                    <span className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{allLines.length - (currentBlockIndex + 1) * BLOCK_SIZE} lignes suivantes masquées (Anti-Capture)</span>
                    </span>
                    <button
                      onClick={() => setCurrentBlockIndex(prev => Math.min(totalBlocks - 1, prev + 1))}
                      className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 text-[10px]"
                    >
                      ▼ Suivant
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Floating Navigation Controls (for Spotlight Mode) */}
          {activeMode === 'spotlight' && fileType === 'text' && (
            <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => setCurrentBlockIndex(prev => Math.max(0, prev - 1))}
                disabled={currentBlockIndex === 0}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-700 transition-all shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold">
                  Section {currentBlockIndex + 1} / {totalBlocks}
                </span>
              </div>

              <button
                onClick={() => setCurrentBlockIndex(prev => Math.min(totalBlocks - 1, prev + 1))}
                disabled={currentBlockIndex >= totalBlocks - 1}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-700 transition-all shadow-xs"
              >
                <span>Suivant</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Footer Security Notice */}
        <footer className="px-4 sm:px-6 py-2 sm:py-2.5 border-t border-inherit text-[10px] sm:text-[11px] opacity-75 flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 bg-black/5 dark:bg-white/5 font-mono">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">Viseur Sécurisé • Capture intégrale neutralisée sur mobile et PC</span>
          </div>
          <div className="truncate">
            © {new Date().getFullYear()} — Dr. M.A. Meziane (ESE ORAN)
          </div>
        </footer>

      </div>
    </div>
  );
};
