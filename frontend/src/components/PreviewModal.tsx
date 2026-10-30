import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Code, 
  Copy, 
  Check, 
  ExternalLink,
  Terminal,
  Loader2
} from 'lucide-react';
import { CourseFile } from '../types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: CourseFile | null;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  file
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!file || !isOpen) {
      setContent(null);
      setIsPdf(false);
      setIsImage(false);
      return;
    }

    const ext = file.originalName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf' || file.mimeType.includes('pdf')) {
      setIsPdf(true);
      return;
    }

    if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext)) {
      setIsImage(true);
      return;
    }

    // Try fetching preview text
    setLoading(true);
    fetch(`/api/files/${file.id}/preview`)
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content);
        } else {
          setContent(null);
        }
      })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [file, isOpen]);

  if (!isOpen || !file) return null;

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-cyber-card border border-cyber-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyber-border bg-cyber-darker">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-cyber-blueLight">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-mono truncate max-w-md">
                {file.title}
              </h3>
              <p className="text-xs text-slate-400">
                {file.originalName} • Rubrique : <span className="text-cyan-400">{file.rubriqueName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {content && (
              <button
                onClick={handleCopy}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-cyber-card border border-cyber-border transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier le code'}</span>
              </button>
            )}

            <a
              href={`/api/files/${file.id}/download`}
              download={file.originalName}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-glow-blue transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-cyber-black flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mb-2" />
              <p className="text-xs font-mono">Chargement de l'aperçu...</p>
            </div>
          ) : isPdf ? (
            <iframe
              src={`/uploads/${file.filename}`}
              title={file.title}
              className="w-full h-[65vh] rounded-xl border border-cyber-border bg-slate-900"
            />
          ) : isImage ? (
            <div className="flex items-center justify-center p-4">
              <img
                src={`/uploads/${file.filename}`}
                alt={file.title}
                className="max-h-[65vh] rounded-xl object-contain border border-cyber-border shadow-lg"
              />
            </div>
          ) : content ? (
            <pre className="p-4 rounded-xl bg-cyber-darker border border-cyber-border text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-blue-600">
              {content}
            </pre>
          ) : (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white mb-2 font-mono">
                Aperçu non disponible directement dans le navigateur
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Ce type de format (archive ou binaire) ne peut pas être prévisualisé directement en texte. Veuillez télécharger le fichier pour l'exploiter.
              </p>
              <a
                href={`/api/files/${file.id}/download`}
                download={file.originalName}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-glow-blue transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger le fichier ({file.originalName})</span>
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
