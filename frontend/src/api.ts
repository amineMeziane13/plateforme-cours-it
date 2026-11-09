import { 
  CourseFile, 
  PlatformStats, 
  Rubrique, 
  GroupLeader, 
  LeaderMessage, 
  SousRubrique 
} from './types';

const API_BASE = '/api';

// Stats
export async function getStats(): Promise<PlatformStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Impossible de charger les statistiques.');
  return res.json();
}

// Rubriques
export async function getRubriques(): Promise<Rubrique[]> {
  const res = await fetch(`${API_BASE}/rubriques`);
  if (!res.ok) throw new Error('Impossible de charger les rubriques.');
  return res.json();
}

export async function createRubrique(data: Partial<Rubrique>): Promise<Rubrique> {
  const res = await fetch(`${API_BASE}/rubriques`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la création de la rubrique.');
  return result;
}

export async function updateRubrique(id: string, data: Partial<Rubrique>): Promise<Rubrique> {
  const res = await fetch(`${API_BASE}/rubriques/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la modification de la rubrique.');
  return result;
}

export async function deleteRubrique(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/rubriques/${id}`, {
    method: 'DELETE'
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression de la rubrique.');
}

// Files
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

export async function uploadFile(formData: FormData): Promise<CourseFile> {
  const res = await fetch(`${API_BASE}/files`, {
    method: 'POST',
    body: formData
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors du dépôt du fichier.');
  return result;
}

export async function updateFile(id: string, formData: FormData): Promise<CourseFile> {
  const res = await fetch(`${API_BASE}/files/${id}`, {
    method: 'PUT',
    body: formData
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la modification du fichier.');
  return result;
}

export async function deleteFile(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/files/${id}`, {
    method: 'DELETE'
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression du fichier.');
}

// Sous-rubriques
export async function addSousRubrique(rubriqueId: string, data: { name: string; description?: string }): Promise<SousRubrique> {
  const res = await fetch(`${API_BASE}/rubriques/${rubriqueId}/sous-rubriques`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la création de la sous-rubrique.');
  return result;
}

export async function deleteSousRubrique(rubriqueId: string, subId: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/rubriques/${rubriqueId}/sous-rubriques/${subId}`, {
    method: 'DELETE'
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression de la sous-rubrique.');
  return result;
}

// Group Leaders & Messages
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

export async function getAdminLeaders(): Promise<GroupLeader[]> {
  const res = await fetch(`${API_BASE}/admin/leaders`);
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la création du délégué.');
  // Return consistent format { leader: result }
  return { leader: result.leader || result };
}

export async function deleteAdminLeader(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/leaders/${id}`, {
    method: 'DELETE'
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression.');
}

export async function getAdminMessages(): Promise<LeaderMessage[]> {
  const res = await fetch(`${API_BASE}/admin/messages`);
  if (!res.ok) throw new Error('Impossible de charger les messages.');
  return res.json();
}

export async function replyAdminMessage(id: string, reply: string): Promise<LeaderMessage> {
  const res = await fetch(`${API_BASE}/admin/messages/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de l\'envoi de la réponse.');
  return result;
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

// Admin Auth
export async function requestDynamicCredentials() {
  const res = await fetch(`${API_BASE}/auth/request-dynamic-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la demande d\'identifiants.');
  return result;
}

export async function loginAdmin(username: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Identifiants invalides.');
  return result;
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
  loginAdmin
};

export default api;
