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
  FileText, 
  FileCode, 
  EyeOff, 
  Lock,
  Type,
  Sparkles
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

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch document preview when file opens
  useEffect(() => {
    if (!isOpen || !file) {
      setContent(null);
      setError(null);
      setLoading(true);
      return;
    }

    setLoading(true);
    setError(null);

    const ext = (file.originalName || file.filename).split('.').pop()?.toLowerCase() || '';

    if (ext === 'pdf' || file.mimeType.includes('pdf')) {
      setFileType('pdf');
      setLoading(false);
    } else if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
      setFileType('image');
      setLoading(false);
    } else {
      setFileType('text');
      fetch(`/api/files/${file.id}/preview`)
        .then(async (res) => {
          if (!res.ok) throw new Error('Impossible de charger le contenu de ce cours.');
          const data = await res.json();
          setContent(data.content || '');
        })
        .catch((err) => {
          setError(err.message || 'Erreur lors du chargement.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, file]);

  // Anti-Screenshot and Anti-Copy Security Listeners
  useEffect(() => {
    if (!isOpen) return;

    // 1. Detect Window Blur / Focus Loss (often triggered during screenshot utility activation like Snipping Tool)
    const handleBlur = () => {
      setIsWindowBlurred(true);
    };
    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    // 2. Intercept Screen Capture / Print / Save / Copy shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setScreenshotWarning(true);
        navigator.clipboard?.writeText?.(''); // clear clipboard
        setTimeout(() => setScreenshotWarning(false), 3000);
        return;
      }

      // Escape to close
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        } else {
          onClose();
        }
      }

      // Block Ctrl+P (Print), Ctrl+S (Save), Ctrl+U (Source), Ctrl+C (Copy), F12 (DevTools)
      if (
        (e.ctrlKey || e.metaKey) && 
        ['p', 's', 'u', 'c', 'a'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))) {
        e.preventDefault();
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen || !file) return null;

  // Reading Theme styles
  const themeStyles = {
    light: 'bg-white text-slate-800 border-slate-200',
    sepia: 'bg-[#FBF0D9] text-[#5F4B32] border-[#E8D7B8]',
    dark: 'bg-[#0D1117] text-slate-200 border-slate-800'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <div 
        ref={containerRef}
        className={`relative w-full max-w-6xl h-[95vh] sm:h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-colors ${themeStyles[readerTheme]}`}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        
        {/* Top Control Bar (Responsive) */}
        <header className="flex flex-wrap items-center justify-between px-4 py-3 border-b border-inherit bg-black/5 dark:bg-white/5 backdrop-blur-sm gap-2 z-20">
          
          {/* Document Title & Protected Badge */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
              {fileType === 'pdf' ? <FileText className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base truncate font-mono">
                  {file.title}
                </h3>
                <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  <Lock className="w-3 h-3" />
                  <span>Lecture Protégée</span>
                </span>
              </div>
              <p className="text-[11px] opacity-70 truncate">
                {file.level} • {file.professor || 'Dr. M.A. Meziane'} • {file.originalName}
              </p>
            </div>
          </div>

          {/* Controls: Zoom, Theme, Font Size, Fullscreen */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs">
            
            {/* Font Size controls (for text / code) */}
            {fileType === 'text' && (
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 border border-inherit">
                <Type className="w-3.5 h-3.5 opacity-70" />
                <button 
                  onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
                  className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 font-bold"
                  title="Diminuer la police"
                >
                  A-
                </button>
                <span className="font-mono text-[10px]">{fontSize}px</span>
                <button 
                  onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
                  className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 font-bold"
                  title="Agrandir la police"
                >
                  A+
                </button>
              </div>
            )}

            {/* Reading Theme selector */}
            <div className="flex items-center rounded-lg p-0.5 bg-black/5 dark:bg-white/10 border border-inherit">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded-md ${readerTheme === 'light' ? 'bg-white shadow-xs text-slate-900' : 'opacity-60'}`}
                title="Thème Blanc"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-1.5 rounded-md ${readerTheme === 'sepia' ? 'bg-[#F2E5C8] shadow-xs text-[#5F4B32]' : 'opacity-60'}`}
                title="Thème Sépia (Confort des yeux)"
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

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center space-x-1 px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 border border-inherit">
              <button 
                onClick={() => setZoom(prev => Math.max(50, prev - 15))}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                title="Dézoomer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-9 text-center">{zoom}%</span>
              <button 
                onClick={() => setZoom(prev => Math.min(200, prev + 15))}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
                title="Zoomer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoom(100)}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 ml-0.5"
                title="Réinitialiser zoom"
              >
                <RotateCcw className="w-3 h-3 opacity-70" />
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
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xl flex items-center space-x-2 animate-bounce">
            <ShieldAlert className="w-4 h-4" />
            <span>Capture d'écran désactivée pour la protection des droits pédagogiques</span>
          </div>
        )}

        {/* Reading Content Area with Watermark Layer */}
        <div className="relative flex-1 overflow-auto p-4 sm:p-8">
          
          {/* SEMI-TRANSPARENT WATERMARK OVERLAY TILES */}
          <div 
            className="pointer-events-none absolute inset-0 z-10 flex flex-wrap items-center justify-around opacity-[0.06] dark:opacity-[0.05] overflow-hidden select-none"
            aria-hidden="true"
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <div 
                key={i} 
                className="text-xs sm:text-sm font-bold uppercase font-mono tracking-widest rotate-[-30deg] p-8 whitespace-nowrap"
              >
                DR. M.A. MEZIANE • ESE ORAN • COPIE INTERDITE
              </div>
            ))}
          </div>

          {/* Window Blur Protection Overlay */}
          {isWindowBlurred && (
            <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 text-white animate-fade-in">
              <div className="p-4 rounded-full bg-red-600/20 border border-red-500/40 mb-3">
                <EyeOff className="w-8 h-8 text-red-400" />
              </div>
              <h4 className="text-base font-bold font-mono mb-1">
                Affichage Masqué pendant le changement de fenêtre
              </h4>
              <p className="text-xs text-slate-300 max-w-md">
                Pour protéger l'intégrité des cours, le document est temporairement flouté. Cliquez ici pour reprendre votre lecture.
              </p>
            </div>
          )}

          {/* Document Content Container */}
          <div 
            style={{ 
              transform: `scale(${zoom / 100})`, 
              transformOrigin: 'top center',
              transition: 'transform 0.15s ease-out'
            }}
            className="w-full flex justify-center"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Chargement optimisé du document...</span>
              </div>
            ) : error ? (
              <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                {error}
              </div>
            ) : fileType === 'pdf' ? (
              /* PDF Viewer with disabled toolbars and secure display */
              <div className="w-full h-[75vh] rounded-xl overflow-hidden shadow-lg border border-inherit bg-slate-100 dark:bg-slate-900">
                <iframe
                  src={`/api/files/${file.id}/preview#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                  className="w-full h-full border-none"
                  title={file.title}
                />
              </div>
            ) : fileType === 'image' ? (
              /* Image Viewer */
              <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border border-inherit">
                <img 
                  src={`/api/files/${file.id}/preview`} 
                  alt={file.title}
                  className="w-full h-auto object-contain pointer-events-none"
                  draggable={false}
                />
              </div>
            ) : (
              /* High-Quality Code / Script / Text Reader */
              <div 
                className="w-full max-w-4xl rounded-2xl p-6 sm:p-8 font-mono shadow-sm border border-inherit overflow-x-auto leading-relaxed"
                style={{ fontSize: `${fontSize}px` }}
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-inherit text-xs opacity-75 font-sans">
                  <span>Fichier source : <strong>{file.originalName}</strong></span>
                  <span>{content ? content.split('\n').length : 0} lignes de code / texte</span>
                </div>

                <pre className="overflow-x-auto whitespace-pre-wrap font-mono">
                  {content ? (
                    content.split('\n').map((line, idx) => (
                      <div key={idx} className="flex space-x-4 hover:bg-black/5 dark:hover:bg-white/5 px-2 rounded">
                        <span className="w-8 text-right opacity-30 select-none text-[11px] font-mono flex-shrink-0">
                          {idx + 1}
                        </span>
                        <span className="flex-1 font-mono">{line || ' '}</span>
                      </div>
                    ))
                  ) : (
                    <span className="opacity-50">Document vide ou inaccessible.</span>
                  )}
                </pre>
              </div>
            )}
          </div>

        </div>

        {/* Footer Security Notice */}
        <footer className="px-6 py-2.5 border-t border-inherit text-[11px] opacity-75 flex flex-col sm:flex-row items-center justify-between gap-2 bg-black/5 dark:bg-white/5 font-mono">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-blue-500" />
            <span>Mode Lecture Sécurisée • Téléchargement & Capture désactivés</span>
          </div>
          <div>
            © {new Date().getFullYear()} — Dr. M.A. Meziane (ESI / ESE ORAN)
          </div>
        </footer>

      </div>
    </div>
  );
};