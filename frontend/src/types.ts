export interface Rubrique {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: 'red' | 'blue' | 'cyan';
  badge?: string;
  filesCount?: number;
  createdAt?: string;
}

export interface CourseFile {
  id: string;
  title: string;
  rubriqueId: string;
  rubriqueName?: string;
  rubriqueColor?: 'red' | 'blue' | 'cyan';
  description: string;
  level: string; // L1, L2, L3, M1, M2, etc.
  professor?: string;
  tags: string[];
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  downloads: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PlatformStats {
  totalFiles: number;
  totalRubriques: number;
  totalDownloads: number;
  totalSizeBytes: number;
}

export interface FilterState {
  rubriqueId: string;
  search: string;
  level: string;
  fileType: string;
  sortBy: 'newest' | 'downloads' | 'title' | 'size';
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
