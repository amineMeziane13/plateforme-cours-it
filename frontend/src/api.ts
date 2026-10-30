import { CourseFile, PlatformStats, Rubrique } from './types';

const API_BASE = '/api';

export const api = {
  // Stats
  async getStats(): Promise<PlatformStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Impossible de charger les statistiques.');
    return res.json();
  },

  // Rubriques
  async getRubriques(): Promise<Rubrique[]> {
    const res = await fetch(`${API_BASE}/rubriques`);
    if (!res.ok) throw new Error('Impossible de charger les rubriques.');
    return res.json();
  },

  async createRubrique(data: Partial<Rubrique>): Promise<Rubrique> {
    const res = await fetch(`${API_BASE}/rubriques`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la création de la rubrique.');
    return result;
  },

  async updateRubrique(id: string, data: Partial<Rubrique>): Promise<Rubrique> {
    const res = await fetch(`${API_BASE}/rubriques/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la modification de la rubrique.');
    return result;
  },

  async deleteRubrique(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/rubriques/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression de la rubrique.');
  },

  // Files
  async getFiles(filters?: {
    rubriqueId?: string;
    search?: string;
    level?: string;
    fileType?: string;
    sortBy?: string;
  }): Promise<CourseFile[]> {
    const params = new URLSearchParams();
    if (filters?.rubriqueId && filters.rubriqueId !== 'all') params.append('rubriqueId', filters.rubriqueId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.level && filters.level !== 'all') params.append('level', filters.level);
    if (filters?.fileType && filters.fileType !== 'all') params.append('fileType', filters.fileType);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);

    const res = await fetch(`${API_BASE}/files?${params.toString()}`);
    if (!res.ok) throw new Error('Impossible de charger les fichiers de cours.');
    return res.json();
  },

  async getFileById(id: string): Promise<CourseFile> {
    const res = await fetch(`${API_BASE}/files/${id}`);
    if (!res.ok) throw new Error('Fichier introuvable.');
    return res.json();
  },

  async uploadFile(formData: FormData): Promise<CourseFile> {
    const res = await fetch(`${API_BASE}/files`, {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors du dépôt du fichier.');
    return result;
  },

  async updateFile(id: string, formData: FormData): Promise<CourseFile> {
    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: 'PUT',
      body: formData
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la modification du fichier.');
    return result;
  },

  async deleteFile(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/files/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression du fichier.');
  },

  getDownloadUrl(id: string): string {
    return `${API_BASE}/files/${id}/download`;
  },

  async previewFile(id: string) {
    const res = await fetch(`${API_BASE}/files/${id}/preview`);
    if (!res.ok) throw new Error('Impossible de prévisualiser ce fichier.');
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await res.json();
    }
    // Return blob for binary preview (pdf/image)
    const blob = await res.blob();
    return {
      type: contentType.includes('pdf') ? 'pdf' : 'image',
      url: URL.createObjectURL(blob),
      blob
    };
  },

  // Admin Auth
  async loginAdmin(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Identifiants invalides.');
    return result;
  }
};
