import React from 'react';
import { 
  FileText, 
  FileCode, 
  FileArchive, 
  Presentation, 
  FileCheck, 
  Download, 
  Eye, 
  Edit3, 
  Trash2, 
  User, 
  Calendar, 
  HardDrive, 
  ArrowUpDown, 
  Filter, 
  Sparkles,
  AlertCircle,
  Plus
} from 'lucide-react';
import { CourseFile, FilterState, Rubrique } from '../types';

interface FileListProps {
  files: CourseFile[];
  rubriques: Rubrique[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  isAdmin: boolean;
  onPreview: (file: CourseFile) => void;
  onEdit: (file: CourseFile) => void;
  onDelete: (file: CourseFile) => void;
  onOpenUpload: () => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  rubriques,
  filters,
  onFilterChange,
  isAdmin,
  onPreview,
  onEdit,
  onDelete,
  onOpenUpload
}) => {
  // File type icon & color helper
  const getFileIcon = (originalName: string, mimeType: string) => {
    const ext = originalName.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf' || mimeType.includes('pdf')) {
      return {
        icon: <FileText className="w-5 h-5 text-red-400" />,
        bg: 'bg-red-500/10 border-red-500/30',
        label: 'PDF'
      };
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return {
        icon: <FileArchive className="w-5 h-5 text-amber-400" />,
        bg: 'bg-amber-500/10 border-amber-500/30',
        label: ext.toUpperCase()
      };
    }
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'sh', 'c', 'cpp', 'java', 'sql', 'html', 'css', 'json'].includes(ext)) {
      return {
        icon: <FileCode className="w-5 h-5 text-blue-400" />,
        bg: 'bg-blue-500/10 border-blue-500/30',
        label: ext.toUpperCase()
      };
    }
    if (['ppt', 'pptx', 'key', 'odp'].includes(ext)) {
      return {
        icon: <Presentation className="w-5 h-5 text-orange-400" />,
        bg: 'bg-orange-500/10 border-orange-500/30',
        label: 'SLIDES'
      };
    }
    return {
      icon: <FileCheck className="w-5 h-5 text-cyan-400" />,
      bg: 'bg-cyan-500/10 border-cyan-500/30',
      label: ext.toUpperCase() || 'DOC'
    };
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Ko';
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} Ko`;
    return `${(kb / 1024).toFixed(2)} Mo`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Direct download trigger
  const handleDownload = (id: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = `/api/files/${id}/download`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Filtering & Sorting Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-cyber-card/60 p-4 rounded-xl border border-cyber-border">
        
        {/* Left: Results Count & Current Context */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-slate-300">
            <span className="font-semibold text-white">{files.length}</span>
            <span>cours et supports trouvés</span>
          </div>

          {filters.rubriqueId !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-cyber-blueLight border border-blue-500/30">
              Rubrique : {rubriques.find(r => r.id === filters.rubriqueId)?.name || 'Sélectionnée'}
            </span>
          )}
        </div>

        {/* Right: Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Level Filter */}
          <div className="flex items-center space-x-1.5 bg-cyber-darker px-3 py-1.5 rounded-lg border border-cyber-border text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.level}
              onChange={(e) => onFilterChange({ level: e.target.value })}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-cyber-darker text-white">Tous niveaux</option>
              <option value="Licence 1" className="bg-cyber-darker text-white">Licence 1 (L1)</option>
              <option value="Licence 2" className="bg-cyber-darker text-white">Licence 2 (L2)</option>
              <option value="Licence 3" className="bg-cyber-darker text-white">Licence 3 (L3)</option>
              <option value="Master 1" className="bg-cyber-darker text-white">Master 1 (M1)</option>
              <option value="Master 2" className="bg-cyber-darker text-white">Master 2 (M2)</option>
              <option value="Certification" className="bg-cyber-darker text-white">Certification / Pro</option>
            </select>
          </div>

          {/* Format Filter */}
          <div className="flex items-center space-x-1.5 bg-cyber-darker px-3 py-1.5 rounded-lg border border-cyber-border text-xs">
            <select
              value={filters.fileType}
              onChange={(e) => onFilterChange({ fileType: e.target.value })}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-cyber-darker text-white">Tous formats</option>
              <option value="pdf" className="bg-cyber-darker text-white">Documents PDF</option>
              <option value="code" className="bg-cyber-darker text-white">Scripts & Code</option>
              <option value="archive" className="bg-cyber-darker text-white">Archives ZIP/TAR</option>
              <option value="slides" className="bg-cyber-darker text-white">Présentations PPTX</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-1.5 bg-cyber-darker px-3 py-1.5 rounded-lg border border-cyber-border text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="bg-transparent text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="newest" className="bg-cyber-darker text-white">Plus récents</option>
              <option value="downloads" className="bg-cyber-darker text-white">Plus téléchargés</option>
              <option value="title" className="bg-cyber-darker text-white">Nom (A-Z)</option>
              <option value="size" className="bg-cyber-darker text-white">Taille du fichier</option>
            </select>
          </div>

        </div>

      </div>

      {/* Course Files Grid */}
      {files.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file) => {
            const fileInfo = getFileIcon(file.originalName, file.mimeType);
            const isRedRub = file.rubriqueColor === 'red';
            const isCyanRub = file.rubriqueColor === 'cyan';

            return (
              <div
                key={file.id}
                className="group relative bg-cyber-card/90 rounded-2xl p-5 border border-cyber-border flex flex-col justify-between cyber-card"
              >
                {/* Header with Type Badge, Rubrique Pill and Level */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    
                    {/* File Type Pill */}
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-xl border ${fileInfo.bg} flex items-center justify-center`}>
                        {fileInfo.icon}
                      </div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300">
                        {fileInfo.label}
                      </span>
                    </div>

                    {/* Rubrique Tag */}
                    <button
                      onClick={() => onFilterChange({ rubriqueId: file.rubriqueId })}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all truncate max-w-[170px] ${
                        isRedRub
                          ? 'badge-red hover:bg-red-500/20'
                          : isCyanRub
                          ? 'badge-cyan hover:bg-cyan-500/20'
                          : 'badge-blue hover:bg-blue-500/20'
                      }`}
                      title={file.rubriqueName}
                    >
                      {file.rubriqueName}
                    </button>
                  </div>

                  {/* Course Title */}
                  <h3 className="font-bold text-base text-white group-hover:text-cyber-blueLight transition-colors leading-snug line-clamp-2">
                    {file.title}
                  </h3>

                  {/* Level & Professor Meta */}
                  <div className="flex items-center flex-wrap gap-2 mt-2 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {file.level || 'Tous niveaux'}
                    </span>
                    {file.professor && (
                      <span className="flex items-center space-x-1 text-slate-400 truncate max-w-[180px]">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{file.professor}</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {file.description && (
                    <p className="mt-3 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {file.description}
                    </p>
                  )}

                  {/* Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {file.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-cyber-darker text-slate-400 border border-cyber-border font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                      {file.tags.length > 4 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                          +{file.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Section */}
                <div className="mt-5 pt-4 border-t border-cyber-border/70">
                  
                  {/* File Metadata Info */}
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3.5">
                    <span className="flex items-center space-x-1 font-mono">
                      <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                      <span>{formatSize(file.sizeBytes)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(file.createdAt)}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 text-red-400 font-mono font-medium">
                      <Download className="w-3 h-3" />
                      <span>{file.downloads || 0}</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    
                    {/* Primary Download Button */}
                    <button
                      onClick={() => handleDownload(file.id, file.originalName)}
                      className="flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-glow-blue transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger</span>
                    </button>

                    {/* Preview Button */}
                    <button
                      onClick={() => onPreview(file)}
                      className="p-2 rounded-xl text-slate-300 hover:text-white bg-cyber-darker hover:bg-cyber-hover border border-cyber-border hover:border-cyan-500/50 transition-all"
                      title="Aperçu rapide"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                    </button>

                    {/* Admin Actions: Edit & Delete */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEdit(file)}
                          className="p-2 rounded-xl text-slate-300 hover:text-blue-400 bg-cyber-darker hover:bg-blue-950/40 border border-cyber-border hover:border-blue-500/50 transition-all"
                          title="Modifier les informations du cours"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(file)}
                          className="p-2 rounded-xl text-slate-300 hover:text-red-400 bg-cyber-darker hover:bg-red-950/40 border border-cyber-border hover:border-red-500/50 transition-all"
                          title="Supprimer ce fichier"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </>
                    )}

                  </div>

                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-cyber-card/40 rounded-2xl border border-dashed border-cyber-border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-glow-blue">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 font-mono">
            Aucun cours ou fichier trouvé
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Aucun document ne correspond à vos critères de recherche ou à la rubrique sélectionnée.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => onFilterChange({ rubriqueId: 'all', search: '', level: 'all', fileType: 'all' })}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-cyber-darker border border-cyber-border hover:text-white transition-all"
            >
              Réinitialiser les filtres
            </button>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-glow-blue transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Déposer un fichier</span>
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
