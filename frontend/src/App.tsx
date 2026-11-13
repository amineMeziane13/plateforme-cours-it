import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RubriquesGrid } from './components/RubriquesGrid';
import { RubriquesBar } from './components/RubriquesBar';
import { FileList } from './components/FileList';
import { UploadModal } from './components/UploadModal';
import { EditModal } from './components/EditModal';
import { DeleteModal } from './components/DeleteModal';
import { RubriquesManagerModal } from './components/RubriquesManagerModal';
import { ReaderModal } from './components/ReaderModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { LeaderPortalModal } from './components/LeaderPortalModal';
import { LeaderManagerModal } from './components/LeaderManagerModal';
import { ToastContainer } from './components/ToastContainer';
import { 
  Rubrique, 
  CourseFile, 
  PlatformStats, 
  FilterState, 
  ToastNotification 
} from './types';
import { api } from './api';
import { Terminal } from 'lucide-react';

export function App() {
  // State
  const [rubriques, setRubriques] = useState<Rubrique[]>([]);
  const [files, setFiles] = useState<CourseFile[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return !!localStorage.getItem('it_platform_admin_token');
  });

  // Theme state: default to 'light' (white theme) as requested
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('it_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // Synchronize <html> root class and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('it_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    rubriqueId: 'all',
    sousRubriqueId: 'all',
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
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLeaderPortalOpen, setIsLeaderPortalOpen] = useState(false);
  const [isLeaderManagerOpen, setIsLeaderManagerOpen] = useState(false);

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

  // Initial Load & Visitor Ping
  useEffect(() => {
    loadRubriques();
    loadStats();

    // Session identification for unique visitor counter
    let sid = localStorage.getItem('it_visitor_session_id');
    if (!sid) {
      sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('it_visitor_session_id', sid);
    }
    api.pingVisitor(sid).then((res) => {
      if (res && res.count) {
        setStats((prev) => prev ? { ...prev, visitorCount: res.count } : null);
      }
    });
  }, [loadRubriques, loadStats]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Handler helpers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectRubrique = (rubriqueId: string) => {
    setFilters((prev) => ({ ...prev, rubriqueId, sousRubriqueId: 'all' }));
  };

  const handleOpenEdit = (file: CourseFile) => {
    setSelectedFile(file);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (file: CourseFile) => {
    setSelectedFile(file);
    setIsDeleteOpen(true);
  };

  const handleOpenReader = (file: CourseFile) => {
    setSelectedFile(file);
    setIsReaderOpen(true);
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
    <div className="min-h-screen bg-slate-50 dark:bg-cyber-black flex flex-col font-sans text-slate-800 dark:text-slate-100 bg-cyber-grid transition-colors duration-200">
      
      {/* Navbar */}
      <Navbar
        isAdmin={isAdmin}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenRubriquesManager={() => setIsRubriquesManagerOpen(true)}
        onOpenLeaderPortal={() => setIsLeaderPortalOpen(true)}
        onOpenLeaderManager={() => setIsLeaderManagerOpen(true)}
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

        {/* Dynamic Display:
            1. If filters.rubriqueId === 'all' AND no search:
               Display large RubriquesGrid (the large 3D icon cards for each category)
            2. If a rubrique is selected OR user typed a search query:
               Display FileList with the files corresponding to that category / search
        */}
        {filters.rubriqueId === 'all' && !filters.search.trim() ? (
          <RubriquesGrid
            rubriques={rubriques}
            onSelectRubrique={handleSelectRubrique}
            isAdmin={isAdmin}
            onOpenRubriquesManager={() => setIsRubriquesManagerOpen(true)}
          />
        ) : (
          <>
            {/* Rubriques Selector Bar for quick switching */}
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
              onPreview={handleOpenReader}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onOpenUpload={() => setIsUploadOpen(true)}
            />
          </>
        )}

      </main>

      {/* Modern Clean Footer with Author & Copyright */}
      <footer className="border-t border-slate-200 dark:border-cyber-border/70 bg-white/90 dark:bg-cyber-darker/90 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-slate-600 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-1 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                IT.ACADEMY
              </span>
            </div>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              © 2026 — <span className="font-bold text-slate-900 dark:text-white">Dr. M.A. Meziane</span>, Maître de Conférences A en Informatique (ESE ORAN) • Tous droits réservés.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="hidden sm:inline">Réseaux</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Cybersécurité</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Développement</span>
            <span className="hidden sm:inline">•</span>
            <span>Cloud & Systèmes</span>
          </div>

          <div className="text-xs font-mono">
            {isAdmin ? (
              <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                <span>Session Enseignant Active</span>
              </span>
            ) : (
              <span className="text-blue-600 dark:text-cyan-400 font-semibold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Mode Consultation Étudiant</span>
              </span>
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

      {/* Reading Mode Modal with Anti-Screenshot, Watermark & High Fidelity */}
      <ReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        file={selectedFile}
      />

      {/* Group Leader Portal (Student delegates communicating with Dr. Meziane) */}
      <LeaderPortalModal
        isOpen={isLeaderPortalOpen}
        onClose={() => setIsLeaderPortalOpen(false)}
        onToast={showToast}
      />

      {/* Group Leader Accounts & Messages Manager (Admin) */}
      <LeaderManagerModal
        isOpen={isLeaderManagerOpen}
        onClose={() => setIsLeaderManagerOpen(false)}
        onToast={showToast}
      />

      {/* Admin Login Modal */}
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
