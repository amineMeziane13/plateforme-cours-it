import { 
  CourseFile, 
  PlatformStats, 
  Rubrique, 
  GroupLeader, 
  LeaderMessage, 
  SousRubrique 
} from './types';

const API_BASE = '/api';
const ADMIN_TOKEN_KEY = 'it_platform_admin_token';

// ==========================================
// ADMIN TOKEN & AUTHORIZATION HELPERS
// ==========================================

export function getAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string): void {
  try {
    sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch (_) {}
}

export function clearAdminToken(): void {
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch (_) {}
}

export function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

function handleUnauthorized() {
  clearAdminToken();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('it_admin_unauthorized'));
  }
}

// ==========================================
// PUBLIC ENDPOINTS (STUDENTS / VISITORS)
// ==========================================

// Stats
export async function getStats(): Promise<PlatformStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Impossible de charger les statistiques.');
  return res.json();
}

// Visitors
export async function pingVisitor(sessionId: string): Promise<{ count: number; isNew: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/visitors/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    if (!res.ok) return { count: 0, isNew: false };
    return res.json();
  } catch {
    return { count: 0, isNew: false };
  }
}

export async function getVisitorCount(): Promise<number> {
  try {
    const res = await fetch(`${API_BASE}/visitors/count`);
    if (!res.ok) return 0;
    const data = await res.json();
    return data.count || 0;
  } catch {
    return 0;
  }
}

// Rubriques (Public Read)
export async function getRubriques(): Promise<Rubrique[]> {
  const res = await fetch(`${API_BASE}/rubriques`);
  if (!res.ok) throw new Error('Impossible de charger les rubriques.');
  return res.json();
}

// Files (Public Read)
export async function getFiles(filters?: {
  rubriqueId?: string;
  sousRubriqueId?: string;
  search?: string;
  level?: string;
  fileType?: string;
  sortBy?: string;
}): Promise<CourseFile[]> {
  const params = new URLSearchParams();
  if (filters?.rubriqueId && filters.rubriqueId !== 'all') params.append('rubriqueId', filters.rubriqueId);
  if (filters?.sousRubriqueId && filters.sousRubriqueId !== 'all') params.append('sousRubriqueId', filters.sousRubriqueId);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.level && filters.level !== 'all') params.append('level', filters.level);
  if (filters?.fileType && filters.fileType !== 'all') params.append('fileType', filters.fileType);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);

  const res = await fetch(`${API_BASE}/files?${params.toString()}`);
  if (!res.ok) throw new Error('Impossible de charger les fichiers de cours.');
  return res.json();
}

export async function getFileById(id: string): Promise<CourseFile> {
  const res = await fetch(`${API_BASE}/files/${id}`);
  if (!res.ok) throw new Error('Fichier introuvable.');
  return res.json();
}

export function getDownloadUrl(id: string): string {
  return `${API_BASE}/files/${id}/download`;
}

export async function previewFile(id: string) {
  const res = await fetch(`${API_BASE}/files/${id}/preview`);
  if (!res.ok) throw new Error('Impossible de prévisualiser ce fichier.');
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return await res.json();
  }
  const blob = await res.blob();
  return {
    type: contentType.includes('pdf') ? 'pdf' : 'image',
    url: URL.createObjectURL(blob),
    blob
  };
}

// ==========================================
// ADMIN MUTATING OPERATIONS (REQUIRE AUTH)
// ==========================================

export async function createRubrique(data: Partial<Rubrique>): Promise<Rubrique> {
  const res = await fetch(`${API_BASE}/rubriques`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la création de la rubrique.');
  return result;
}

export async function updateRubrique(id: string, data: Partial<Rubrique>): Promise<Rubrique> {
  const res = await fetch(`${API_BASE}/rubriques/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la modification de la rubrique.');
  return result;
}

export async function deleteRubrique(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/rubriques/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression de la rubrique.');
}

export async function addSousRubrique(rubriqueId: string, data: { name: string; description?: string }): Promise<SousRubrique> {
  const res = await fetch(`${API_BASE}/rubriques/${rubriqueId}/sous-rubriques`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la création de la sous-rubrique.');
  return result;
}

export async function deleteSousRubrique(rubriqueId: string, subId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/rubriques/${rubriqueId}/sous-rubriques/${subId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression de la sous-rubrique.');
  return result;
}

// Upload file (Admin)
export async function uploadFile(formData: FormData): Promise<CourseFile> {
  const res = await fetch(`${API_BASE}/files`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise pour déposer un fichier.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors du dépôt du fichier.');
  return result;
}

// Update file (Admin)
export async function updateFile(id: string, formData: FormData): Promise<CourseFile> {
  const res = await fetch(`${API_BASE}/files/${id}`, {
    method: 'PUT',
    headers: {
      ...getAuthHeaders()
    },
    body: formData
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise pour modifier un fichier.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la modification du fichier.');
  return result;
}

// Delete file (Admin)
export async function deleteFile(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/files/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise pour supprimer un fichier.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression du fichier.');
}

// Group Leaders Management (Admin)
export async function getAdminLeaders(): Promise<GroupLeader[]> {
  const res = await fetch(`${API_BASE}/admin/leaders`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  if (!res.ok) throw new Error('Impossible de charger les délégués de groupe.');
  return res.json();
}

export async function createAdminLeader(data: {
  username: string;
  password: string;
  studentName: string;
  groupName: string;
}): Promise<{ leader: GroupLeader }> {
  const res = await fetch(`${API_BASE}/admin/leaders`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la création du délégué.');
  return { leader: result.leader || result };
}

export async function deleteAdminLeader(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/leaders/${id}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders()
    }
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression.');
}

export async function getAdminMessages(): Promise<LeaderMessage[]> {
  const res = await fetch(`${API_BASE}/admin/messages`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  if (!res.ok) throw new Error('Impossible de charger les messages.');
  return res.json();
}

export async function replyAdminMessage(id: string, reply: string): Promise<LeaderMessage> {
  const res = await fetch(`${API_BASE}/admin/messages/${id}/reply`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ reply })
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de l\'envoi de la réponse.');
  return result;
}

// Database Export & Import (Admin)
export async function downloadDatabaseBackup(): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/database/export`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  if (!res.ok) throw new Error('Erreur lors de l\'export de la base de données.');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-it-academy-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export async function importDatabase(data: any): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/admin/database/import`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Non autorisé. Session administrateur requise.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la restauration.');
  return result;
}

// Assiduité Pro Attendance Sync (Admin)
export async function syncAttendance(data: any): Promise<{ success: boolean; message: string; stats?: any }> {
  const res = await fetch(`${API_BASE}/admin/attendance/sync`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(data)
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Session administrateur expirée ou requise. Veuillez vous reconnecter.');
  }
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la synchronisation.');
  return result;
}

export async function getAttendanceStats(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/attendance/stats`, {
    headers: {
      ...getAuthHeaders()
    }
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Session administrateur expirée ou requise. Veuillez vous reconnecter.');
  }
  if (!res.ok) throw new Error('Impossible de charger les statistiques d\'assiduité.');
  return res.json();
}

// ==========================================
// GROUP LEADERS PORTAL (STUDENT DELEGATES)
// ==========================================

export async function loginLeader(username: string, password: string): Promise<{ leader: GroupLeader; token: string }> {
  const res = await fetch(`${API_BASE}/leaders/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Identifiant ou mot de passe délégué incorrect.');
  return result;
}

export async function getLeaderMessages(leaderId?: string): Promise<LeaderMessage[]> {
  const query = leaderId ? `?leaderId=${encodeURIComponent(leaderId)}` : '';
  const res = await fetch(`${API_BASE}/leaders/messages${query}`);
  if (!res.ok) throw new Error('Impossible de charger vos messages.');
  return res.json();
}

export async function sendLeaderMessage(data: {
  leaderId: string;
  leaderName: string;
  groupName: string;
  subject: string;
  content: string;
}): Promise<LeaderMessage> {
  const res = await fetch(`${API_BASE}/leaders/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de l\'envoi du message.');
  return result;
}

// ==========================================
// ADMIN AUTHENTICATION API
// ==========================================

export async function requestDynamicCredentials() {
  const res = await fetch(`${API_BASE}/auth/request-dynamic-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la demande d\'identifiants.');
  return result;
}

export async function loginAdmin(username: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Identifiants invalides.');
  if (result.token) {
    setAdminToken(result.token);
  }
  return result;
}

export async function verifyAdminToken(tokenToVerify?: string): Promise<{ valid: boolean; user?: any }> {
  const token = tokenToVerify || getAdminToken();
  if (!token) return { valid: false };
  try {
    const res = await fetch(`${API_BASE}/auth/verify-admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) {
      clearAdminToken();
      return { valid: false };
    }
    const data = await res.json();
    return data;
  } catch {
    return { valid: false };
  }
}

export async function logoutAdmin(): Promise<void> {
  const token = getAdminToken();
  try {
    if (token) {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  } catch (_) {
    // Ignore network error on logout
  } finally {
    clearAdminToken();
  }
}

export const api = {
  getStats,
  getRubriques,
  createRubrique,
  updateRubrique,
  deleteRubrique,
  getFiles,
  getFileById,
  uploadFile,
  updateFile,
  deleteFile,
  addSousRubrique,
  deleteSousRubrique,
  loginLeader,
  getLeaderMessages,
  sendLeaderMessage,
  getAdminLeaders,
  createAdminLeader,
  deleteAdminLeader,
  getAdminMessages,
  replyAdminMessage,
  getDownloadUrl,
  previewFile,
  requestDynamicCredentials,
  loginAdmin,
  verifyAdminToken,
  logoutAdmin,
  pingVisitor,
  getVisitorCount,
  downloadDatabaseBackup,
  importDatabase,
  syncAttendance,
  getAttendanceStats,
  getAdminToken,
  setAdminToken,
  clearAdminToken
};

export default api;
