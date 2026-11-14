import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sun, 
  Moon, 
  BookOpen, 
  Lock, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  FileCode, 
  FileArchive, 
  Presentation, 
  WrapText, 
  Type, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Scan
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
  const [fileType, setFileType] = useState<'text' | 'pdf' | 'image' | 'archive' | 'document' | 'other'>('text');
  const [streamUrl, setStreamUrl] = useState<string>('');

  // Reader customization state
  const [fontSize, setFontSize] = useState<number>(14);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isWrapText, setIsWrapText] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [imageZoom, setImageZoom] = useState<number>(100);

  // Optional Spotlight / Focus mode (off by default so user can read smoothly)
  const [isSpotlightMode, setIsSpotlightMode] = useState<boolean>(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
  const BLOCK_SIZE = 25; // 25 lines per block if spotlight is manually enabled

  const containerRef = useRef<HTMLDivElement>(null);

  // Reset & load file preview when modal opens
  useEffect(() => {
    if (!isOpen || !file) {
      setContent(null);
      setError(null);
      setLoading(true);
      setImageZoom(100);
      setIsSpotlightMode(false);
      setCurrentBlockIndex(0);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentBlockIndex(0);

    const viewUrl = `/api/files/${file.id}/view`;
    setStreamUrl(viewUrl);

    fetch(`/api/files/${file.id}/preview?format=json`, {
      headers: { 'Accept': 'application/json' }
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Impossible de charger le contenu de ce document.');
        }
        const data = await res.json();
        const detectedType = data.type || 'text';
        setFileType(detectedType);

        if (detectedType === 'text') {
          setContent(data.content || '');
        } else if (detectedType === 'pdf') {
          setContent(data.streamUrl || viewUrl);
        } else if (detectedType === 'image') {
          setContent(data.dataUrl || data.streamUrl || viewUrl);
        } else {
          setContent(data.content || '');
        }
      })
      .catch((err) => {
        console.error('Erreur chargement preview:', err);
        setError(err.message || 'Erreur lors du chargement du fichier.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, file]);

  // Context Menu and Print Prevention
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Print (Ctrl+P) and Save (Ctrl+S)
      if ((e.ctrlKey || e.metaKey) && ['p', 's'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
      // Escape to close
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

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

  const handleCopyText = () => {
    if (!content) return;
    try {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (_) {}
  };

  if (!isOpen || !file) return null;

  // Split lines for text content
  const allLines = content ? content.split('\n') : [];
  const totalBlocks = Math.max(1, Math.ceil(allLines.length / BLOCK_SIZE));
  const visibleLines = isSpotlightMode 
    ? allLines.slice(currentBlockIndex * BLOCK_SIZE, (currentBlockIndex + 1) * BLOCK_SIZE)
    : allLines;
  const startLineNumber = isSpotlightMode ? currentBlockIndex * BLOCK_SIZE + 1 : 1;

  // Theme-dependent styles
  const themeStyles = {
    light: {
      bg: 'bg-white',
      text: 'text-slate-800',
      border: 'border-slate-200',
      headerBg: 'bg-slate-50',
      codeBg: 'bg-slate-50/70',
      lineNum: 'text-slate-400'
    },
    sepia: {
      bg: 'bg-[#FBF0D9]',
      text: 'text-[#433422]',
      border: 'border-[#E8D7B8]',
      headerBg: 'bg-[#F5E4C3]',
      codeBg: 'bg-[#F7EBD3]',
      lineNum: 'text-[#9C8265]'
    },
    dark: {
      bg: 'bg-[#0B111E]',
      text: 'text-slate-100',
      border: 'border-slate-800',
      headerBg: 'bg-[#080C14]',
      codeBg: 'bg-[#0F172A]',
      lineNum: 'text-slate-600'
    }
  }[readerTheme];

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 Ko';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} Ko`;
    return `${(kb / 1024).toFixed(2)} Mo`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Strict Print Protection Style */}
      <style>{`
        @media print {
          body, #root, .reader-modal-container {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>

      <div 
        ref={containerRef}
        className={`reader-modal-container relative w-full max-w-6xl h-[94vh] rounded-2xl flex flex-col shadow-2xl border overflow-hidden transition-colors ${themeStyles.bg} ${themeStyles.border} ${themeStyles.text}`}
      >
        
        {/* Top Header Bar */}
        <header className={`flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b ${themeStyles.border} ${themeStyles.headerBg} gap-2`}>
          
          {/* Document Title & Metadata */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs shrink-0">
              {fileType === 'pdf' ? <FileText className="w-4 h-4" /> :
               fileType === 'archive' ? <FileArchive className="w-4 h-4" /> :
               fileType === 'document' ? <Presentation className="w-4 h-4" /> :
               <FileCode className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                  {file.rubriqueName || 'Support de Cours'}
                </span>
                <span className="text-xs opacity-40">•</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${
                  file.downloadable 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                }`}>
                  {file.downloadable ? 'Téléchargeable' : 'Mode Lecture Protégé'}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold truncate max-w-md lg:max-w-xl">
                {file.title}
              </h2>
            </div>
          </div>

          {/* Reader Controls Toolbar */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs">
            
            {/* Text View specific controls (font size, wrap, copy) */}
            {fileType === 'text' && (
              <>
                {/* Font Size Adjuster */}
                <div className="flex items-center space-x-1 px-1.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 border border-inherit">
                  <button
                    onClick={() => setFontSize(prev => Math.max(11, prev - 1))}
                    className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 font-mono text-xs font-bold"
                    title="Diminuer la police"
                  >
                    A-
                  </button>
                  <span className="text-[10px] font-mono opacity-60 w-5 text-center">{fontSize}</span>
                  <button
                    onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
                    className="px-1.5 py-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 font-mono text-xs font-bold"
                    title="Agrandir la police"
                  >
                    A+
                  </button>
                </div>

                {/* Wrap Text Toggle */}
                <button
                  onClick={() => setIsWrapText(prev => !prev)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    isWrapText ? 'bg-blue-600 text-white border-blue-600' : 'bg-black/5 dark:bg-white/10 border-inherit opacity-70'
                  }`}
                  title={isWrapText ? "Retour à la ligne activé" : "Retour à la ligne désactivé"}
                >
                  <WrapText className="w-3.5 h-3.5" />
                </button>

                {/* Copy Text Button */}
                <button
                  onClick={handleCopyText}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border border-inherit font-medium transition-all"
                  title="Copier le contenu dans le presse-papiers"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copier</span>
                    </>
                  )}
                </button>

                {/* Spotlight / Full View Toggle */}
                <button
                  onClick={() => setIsSpotlightMode(prev => !prev)}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                    isSpotlightMode 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                      : 'bg-black/5 dark:bg-white/10 border-inherit opacity-70'
                  }`}
                  title="Activer/Désactiver le mode focus par section"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isSpotlightMode ? 'Vue Focus' : 'Plein Texte'}</span>
                </button>
              </>
            )}

            {/* Image Zoom controls */}
            {fileType === 'image' && (
              <div className="flex items-center space-x-1 px-1.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 border border-inherit">
                <button
                  onClick={() => setImageZoom(prev => Math.max(50, prev - 25))}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                  title="Zoom arrière"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono px-1">{imageZoom}%</span>
                <button
                  onClick={() => setImageZoom(prev => Math.min(250, prev + 25))}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                  title="Zoom avant"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setImageZoom(100)}
                  className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                  title="Réinitialiser le zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Direct Download Button (if file is downloadable) */}
            {file.downloadable && (
              <a
                href={`/api/files/${file.id}/download`}
                download={file.originalName}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 font-bold hover:bg-emerald-100 transition-all shadow-xs"
                title="Télécharger ce fichier sur votre appareil"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Télécharger</span>
              </a>
            )}

            {/* Themes Switcher */}
            <div className="flex items-center space-x-1 px-1 py-0.5 rounded-lg bg-black/5 dark:bg-white/10 border border-inherit">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded-md transition-all ${readerTheme === 'light' ? 'bg-white shadow-xs text-slate-900' : 'opacity-60'}`}
                title="Thème Clair"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-1.5 rounded-md transition-all ${readerTheme === 'sepia' ? 'bg-[#F2E5C8] shadow-xs text-[#5F4B32]' : 'opacity-60'}`}
                title="Thème Sépia (Confort des yeux)"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded-md transition-all ${readerTheme === 'dark' ? 'bg-slate-800 shadow-xs text-white' : 'opacity-60'}`}
                title="Thème Sombre"
              >
                <Moon className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 border border-inherit hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors ml-1"
              title="Fermer la visionneuse"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </header>

        {/* Content Viewer Body */}
        <div className="relative flex-1 overflow-hidden flex flex-col">
          
          {/* Discreet Transparent Watermark Background */}
          <div 
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.035] select-none overflow-hidden"
            aria-hidden="true"
          >
            <div className="text-4xl sm:text-6xl font-black uppercase font-mono tracking-widest rotate-[-25deg] text-center select-none">
              IT ACADEMY • DR. M.A. MEZIANE<br />CONSULTATION ACADÉMIQUE PROTÉGÉE
            </div>
          </div>

          {/* Main Content Renderers */}
          <div className="relative z-10 w-full h-full flex-1 overflow-auto flex flex-col">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-slate-500 space-y-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Chargement du document haute fidélité...</span>
              </div>
            ) : error ? (
              <div className="m-auto p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs text-center max-w-md">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="font-bold mb-1">Impossible d'afficher le document</div>
                <div>{error}</div>
              </div>
            ) : fileType === 'pdf' ? (
              /* PDF Viewer - Clean, unobstructed full-height embedded viewer */
              <div className="w-full h-full flex-1 bg-slate-900">
                <iframe
                  src={`${streamUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full border-none"
                  title={file.title}
                />
              </div>
            ) : fileType === 'image' ? (
              /* Image Viewer with interactive zoom */
              <div className="w-full h-full flex-1 flex items-center justify-center p-4 overflow-auto">
                <img 
                  src={content || streamUrl} 
                  alt={file.title}
                  style={{ transform: `scale(${imageZoom / 100})`, transition: 'transform 0.15s ease-out' }}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg select-none"
                  draggable={false}
                />
              </div>
            ) : (fileType === 'archive' || fileType === 'document') ? (
              /* Archive (.zip, .rar) / Office Document card */
              <div className="m-auto max-w-lg p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-inherit text-center shadow-lg space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20 flex items-center justify-center">
                  {fileType === 'archive' ? <FileArchive className="w-8 h-8" /> : <Presentation className="w-8 h-8" />}
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                    {fileType === 'archive' ? 'Fichier Archive / Code Source' : 'Document Pédagogique'}
                  </span>
                  <h3 className="text-lg font-bold mt-1 text-inherit">{file.title}</h3>
                  <p className="text-xs opacity-75 font-mono mt-1">
                    Fichier : {file.originalName} ({formatSize(file.sizeBytes)})
                  </p>
                </div>
                {file.description && (
                  <p className="text-xs opacity-85 leading-relaxed text-left p-4 rounded-xl bg-black/5 dark:bg-white/5">
                    {file.description}
                  </p>
                )}
                {file.downloadable ? (
                  <div className="pt-2">
                    <a
                      href={`/api/files/${file.id}/download`}
                      download={file.originalName}
                      className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Télécharger le paquet complet ({formatSize(file.sizeBytes)})</span>
                    </a>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs">
                    <Lock className="w-4 h-4" />
                    <span>Téléchargement restreint par l'enseignant</span>
                  </div>
                )}
              </div>
            ) : (
              /* Text / Code / Markdown Viewer - Full document scrolling with line numbers */
              <div className="w-full h-full flex flex-col p-3 sm:p-6 overflow-hidden">
                
                {/* Spotlight pagination bar (if user turned Spotlight mode ON) */}
                {isSpotlightMode && (
                  <div className="flex items-center justify-between mb-3 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-mono">
                    <button
                      onClick={() => setCurrentBlockIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentBlockIndex === 0}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Section Précédente</span>
                    </button>
                    <span>
                      Section {currentBlockIndex + 1} / {totalBlocks} ({allLines.length} lignes)
                    </span>
                    <button
                      onClick={() => setCurrentBlockIndex(prev => Math.min(totalBlocks - 1, prev + 1))}
                      disabled={currentBlockIndex >= totalBlocks - 1}
                      className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-30 disabled:pointer-events-none hover:bg-blue-700"
                    >
                      <span>Section Suivante</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Full-width, comfortable syntax code/text viewer */}
                <div className={`w-full flex-1 overflow-auto rounded-2xl border ${themeStyles.border} ${themeStyles.codeBg} p-4 sm:p-6 shadow-xs`}>
                  <pre 
                    className={`font-mono leading-relaxed ${isWrapText ? 'whitespace-pre-wrap break-words' : 'whitespace-pre overflow-x-auto'}`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {visibleLines.length > 0 ? (
                      visibleLines.map((line, idx) => {
                        const lineNum = startLineNumber + idx;
                        return (
                          <div 
                            key={idx} 
                            className="flex items-start space-x-3 sm:space-x-4 hover:bg-black/5 dark:hover:bg-white/5 px-1 py-0.5 rounded transition-colors"
                          >
                            <span className={`w-8 sm:w-10 text-right select-none font-mono text-[11px] shrink-0 pt-0.5 ${themeStyles.lineNum}`}>
                              {lineNum}
                            </span>
                            <span className="flex-1 font-mono">{line || ' '}</span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="opacity-50 font-mono">Document vide.</span>
                    )}
                  </pre>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Footer Bar */}
        <footer className={`px-4 sm:px-6 py-2 border-t ${themeStyles.border} ${themeStyles.headerBg} text-[11px] opacity-75 flex flex-wrap items-center justify-between gap-2 font-mono`}>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>IT Academy • Consultation Haute Fidélité</span>
            {file.level && <span>• Niveau {file.level}</span>}
          </div>
          <div>
            {file.professor ? `Enseignant : ${file.professor}` : 'Dr. M.A. Meziane (ESE ORAN)'}
          </div>
        </footer>

      </div>
    </div>
  );
};
