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
  AlertCircle,
  Plus,
  ArrowLeft,
  Layers,
  BookOpen
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
        icon: <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />,
        bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30',
        label: 'PDF'
      };
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return {
        icon: <FileArchive className="w-5 h-5 text-amber-500 dark:text-amber-400" />,
        bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
        label: ext.toUpperCase()
      };
    }
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'sh', 'c', 'cpp', 'java', 'sql', 'html', 'css', 'json'].includes(ext)) {
      return {
        icon: <FileCode className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
        bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
        label: ext.toUpperCase()
      };
    }
    if (['ppt', 'pptx', 'key', 'odp'].includes(ext)) {
      return {
        icon: <Presentation className="w-5 h-5 text-orange-500 dark:text-orange-400" />,
        bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30',
        label: 'SLIDES'
      };
    }
    return {
      icon: <FileCheck className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />,
      bg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30',
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
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* Active Category Header with Back Button */}
      {filters.rubriqueId !== 'all' && (
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-cyber-card border border-blue-200 dark:border-blue-500/30 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => onFilterChange({ rubriqueId: 'all' })}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-cyber-darker hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 border border-slate-200 dark:border-cyber-border transition-all shadow-xs group"
              title="Revenir à la vue de toutes les rubriques"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Toutes les Rubriques</span>
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-mono uppercase font-bold text-blue-600 dark:text-cyber-blueLight">
                  Rubrique Active
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {files.length} document{files.length > 1 ? 's' : ''} disponible{files.length > 1 ? 's' : ''}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                {rubriques.find(r => r.id === filters.rubriqueId)?.name || 'Cours de la rubrique'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md hidden md:block">
            {rubriques.find(r => r.id === filters.rubriqueId)?.description}
          </p>
        </div>
      )}
      
      {/* Filtering & Sorting Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 bg-white dark:bg-cyber-card/60 p-4 rounded-xl border border-slate-200 dark:border-cyber-border shadow-xs transition-colors">
        
        {/* Left: Results Count & Current Context */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-900 dark:text-white">{files.length}</span>
            <span>cours et supports trouvés</span>
          </div>

          {filters.rubriqueId !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-cyber-blueLight border border-blue-200 dark:border-blue-500/30">
              Rubrique : {rubriques.find(r => r.id === filters.rubriqueId)?.name || 'Sélectionnée'}
            </span>
          )}
        </div>

        {/* Right: Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Level Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-cyber-darker px-3 py-1.5 rounded-lg border border-slate-200 dark:border-cyber-border text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={filters.level}
              onChange={(e) => onFilterChange({ level: e.target.value })}
              className="bg-transparent text-slate-700 dark:text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Tous niveaux</option>
              <option value="Licence 1" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Licence 1 (L1)</option>
              <option value="Licence 2" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Licence 2 (L2)</option>
              <option value="Licence 3" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Licence 3 (L3)</option>
              <option value="Master 1" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Master 1 (M1)</option>
              <option value="Master 2" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Master 2 (M2)</option>
              <option value="Certification" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Certification / Pro</option>
            </select>
          </div>

          {/* Format Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-cyber-darker px-3 py-1.5 rounded-lg border border-slate-200 dark:border-cyber-border text-xs">
            <select
              value={filters.fileType}
              onChange={(e) => onFilterChange({ fileType: e.target.value })}
              className="bg-transparent text-slate-700 dark:text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Tous formats</option>
              <option value="pdf" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Documents PDF</option>
              <option value="code" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Scripts & Code</option>
              <option value="archive" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Archives ZIP/TAR</option>
              <option value="slides" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Présentations PPTX</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-cyber-darker px-3 py-1.5 rounded-lg border border-slate-200 dark:border-cyber-border text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="bg-transparent text-slate-700 dark:text-slate-200 outline-none cursor-pointer text-xs"
            >
              <option value="newest" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Plus récents</option>
              <option value="downloads" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Plus téléchargés</option>
              <option value="title" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Nom (A-Z)</option>
              <option value="size" className="bg-white dark:bg-cyber-darker text-slate-900 dark:text-white">Taille du fichier</option>
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
                className="group relative bg-white dark:bg-cyber-card/90 rounded-2xl p-5 border border-slate-200/90 dark:border-cyber-border flex flex-col justify-between cyber-card shadow-xs transition-colors"
              >
                {/* Header with Type Badge, Rubrique Pill and Level */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    
                    {/* File Type Pill */}
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-xl border ${fileInfo.bg} flex items-center justify-center`}>
                        {fileInfo.icon}
                      </div>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        {fileInfo.label}
                      </span>
                    </div>

                    {/* Rubrique Tag */}
                    <button
                      onClick={() => onFilterChange({ rubriqueId: file.rubriqueId })}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all truncate max-w-[170px] ${
                        isRedRub
                          ? 'badge-red hover:opacity-80'
                          : isCyanRub
                          ? 'badge-cyan hover:opacity-80'
                          : 'badge-blue hover:opacity-80'
                      }`}
                      title={file.rubriqueName}
                    >
                      {file.rubriqueName}
                    </button>
                  </div>

                  {/* Course Title */}
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyber-blueLight transition-colors leading-snug line-clamp-2">
                    {file.title}
                  </h3>

                  {/* Level & Professor Meta */}
                  <div className="flex items-center flex-wrap gap-2 mt-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {file.level || 'Tous niveaux'}
                    </span>
                    {file.professor && (
                      <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{file.professor}</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {file.description && (
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {file.description}
                    </p>
                  )}

                  {/* Tags */}
                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {file.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-cyber-darker text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-cyber-border font-mono"
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
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-cyber-border/70">
                  
                  {/* File Metadata Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3.5">
                    <span className="flex items-center space-x-1 font-mono">
                      <HardDrive className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                      <span>{formatSize(file.sizeBytes)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(file.createdAt)}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1 text-red-600 dark:text-red-400 font-mono font-medium">
                      <Download className="w-3 h-3" />
                      <span>{file.downloads || 0}</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    
                    {/* Primary Download Button */}
                    <button
                      onClick={() => handleDownload(file.id, file.originalName)}
                      className="flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger</span>
                    </button>

                    {/* Preview Button */}
                    <button
                      onClick={() => onPreview(file)}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-cyber-darker hover:bg-slate-200 dark:hover:bg-cyber-hover border border-slate-200 dark:border-cyber-border transition-all"
                      title="Aperçu rapide"
                    >
                      <Eye className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </button>

                    {/* Admin Actions: Edit & Delete */}
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onEdit(file)}
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-cyber-darker hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-cyber-border transition-all"
                          title="Modifier les informations du cours"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(file)}
                          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-slate-100 dark:bg-cyber-darker hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-cyber-border transition-all"
                          title="Supprimer ce fichier"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
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
        <div className="text-center py-16 px-4 bg-white dark:bg-cyber-card/40 rounded-2xl border border-dashed border-slate-200 dark:border-cyber-border shadow-xs">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 font-mono">
            Aucun cours ou fichier trouvé
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Aucun document ne correspond à vos critères de recherche ou à la rubrique sélectionnée.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => onFilterChange({ rubriqueId: 'all', search: '', level: 'all', fileType: 'all' })}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-cyber-darker border border-slate-200 dark:border-cyber-border hover:bg-slate-200 transition-all"
            >
              Réinitialiser les filtres
            </button>
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
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
