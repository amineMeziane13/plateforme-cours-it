export interface SousRubrique {
  id: string;
  rubriqueId: string;
  name: string;
  description?: string;
}

export interface Rubrique {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
  filesCount?: number;
  sousRubriques?: SousRubrique[];
  createdAt?: string;
}

export interface CourseFile {
  id: string;
  title: string;
  rubriqueId: string;
  rubriqueName?: string;
  rubriqueColor?: string;
  sousRubriqueId?: string;
  sousRubriqueName?: string;
  description: string;
  level: string; // L1, L2, L3, M1, M2, etc.
  professor?: string;
  tags: string[];
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  downloads?: number;
  views?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PlatformStats {
  totalFiles: number;
  totalRubriques: number;
  totalViews?: number;
  totalDownloads?: number;
  totalSizeBytes: number;
}

export interface FilterState {
  rubriqueId: string;
  sousRubriqueId?: string;
  search: string;
  level: string;
  fileType: string;
  sortBy: 'newest' | 'title' | 'size' | 'views';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export interface GroupLeader {
  id: string;
  username: string;
  studentName: string;
  groupName: string;
  createdAt: string;
}

export interface LeaderMessage {
  id: string;
  leaderId: string;
  leaderName: string;
  groupName: string;
  subject: string;
  content: string;
  reply?: string;
  repliedAt?: string;
  status: 'pending' | 'replied';
  createdAt: string;
}
