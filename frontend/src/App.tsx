import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RubriquesBar } from './components/RubriquesBar';
import { FileList } from './components/FileList';
import { UploadModal } from './components/UploadModal';
import { EditModal } from './components/EditModal';
import { DeleteModal } from './components/DeleteModal';
import { RubriquesManagerModal } from './components/RubriquesManagerModal';
import { PreviewModal } from './components/PreviewModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ToastContainer } from './components/ToastContainer';
import { 
  Rubrique, 
  CourseFile, 
  PlatformStats, 
  FilterState, 
  ToastNotification 
} from './types';
import { api } from './api';
import { Terminal, Shield, Heart, ExternalLink } from 'lucide-react';

export function App() {
  // State
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return !!localStorage.getItem('it_platform_admin_token');
  });

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    rubriqueId: 'all',
    search: '',
    level: 'all',
    fileType: 'all',
    sortBy: 'newest'
  });

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isRubriquesManagerOpen, setIsRubriquesManagerOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Selected file for modals
  const [selectedFile, setSelectedFile] = useState<CourseFile | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Data
  const loadRubriques = useCallback(async () => {
    try {
      const data = await api.getRubriques();
      setRubriques(data);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err: any) {
      console.error(err);
    }
  }, []);

  const loadFiles = useCallback(async () => {
    try {
      const data = await api.getFiles(filters);
      setFiles(data);
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Erreur de chargement', 'Impossible de récupérer les fichiers.');
    }
  }, [filters, showToast]);

  // Initial Load
  useEffect(() => {
    loadRubriques();
    loadStats();
  }, [loadRubriques, loadStats]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Handler helpers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectRubrique = (rubriqueId: string) => {
    setFilters((prev) => ({ ...prev, rubriqueId }));
  };

  const handleOpenEdit = (file: CourseFile) => {
    setSelectedFile(file);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (file: CourseFile) => {
    setSelectedFile(file);
    setIsDeleteOpen(true);
  };

  const handleOpenPreview = (file: CourseFile) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('it_platform_admin_token');
    setIsAdmin(false);
    showToast('info', 'Déconnexion', 'Vous êtes repassé en mode consultation étudiante.');
  };

  const refreshAll = () => {
    loadRubriques();
    loadStats();
    loadFiles();
  };

  return (
    <div className="min-h-screen bg-cyber-black flex flex-col font-sans text-slate-100 bg-cyber-grid">
      
      {/* Navbar */}
      <Navbar
        isAdmin={isAdmin}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenRubriquesManager={() => setIsRubriquesManagerOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero & Metrics */}
        <HeroSection
          stats={stats}
          search={filters.search}
          onSearchChange={(search) => handleFilterChange({ search })}
          isAdmin={isAdmin}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

        {/* Rubriques Selector Bar */}
        <RubriquesBar
          rubriques={rubriques}
          selectedRubriqueId={filters.rubriqueId}
          onSelectRubrique={handleSelectRubrique}
          isAdmin={isAdmin}
          onOpenRubriquesManager={() => setIsRubriquesManagerOpen(true)}
        />

        {/* File Grid & Filtering */}
        <FileList
          files={files}
          rubriques={rubriques}
          filters={filters}
          onFilterChange={handleFilterChange}
          isAdmin={isAdmin}
          onPreview={handleOpenPreview}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
          onOpenUpload={() => setIsUploadOpen(true)}
        />

      </main>

      {/* Modern Cyber Footer */}
      <footer className="border-t border-cyber-border/70 bg-cyber-darker/80 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyber-blueLight" />
            <span className="font-mono text-xs font-bold text-slate-300">
              Plateforme Pédagogique IT & Télécoms
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              Système de gestion de documents de cours
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <span>Réseaux</span>
            <span>•</span>
            <span>Cybersécurité</span>
            <span>•</span>
            <span>Développement</span>
            <span>•</span>
            <span>Cloud & DevOps</span>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {isAdmin ? (
              <span className="text-red-400">● Session Administrateur Active</span>
            ) : (
              <span className="text-blue-400">● Mode Étudiant / Consultation</span>
            )}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        rubriques={rubriques}
        defaultRubriqueId={filters.rubriqueId !== 'all' ? filters.rubriqueId : undefined}
        onUploadSuccess={refreshAll}
        showToast={showToast}
        isAdmin={isAdmin}
        onOpenLogin={() => {
          setIsUploadOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <EditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        file={selectedFile}
        rubriques={rubriques}
        onEditSuccess={refreshAll}
        showToast={showToast}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        file={selectedFile}
        onDeleteSuccess={refreshAll}
        showToast={showToast}
      />

      <RubriquesManagerModal
        isOpen={isRubriquesManagerOpen}
        onClose={() => setIsRubriquesManagerOpen(false)}
        rubriques={rubriques}
        onRefresh={refreshAll}
        showToast={showToast}
      />

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        file={selectedFile}
      />

      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdmin(true);
          refreshAll();
        }}
        showToast={showToast}
      />

      {/* Floating Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}

export default App;
