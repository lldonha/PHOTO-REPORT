// Types for Photo Report Mobile App

export interface PhotoMetadata {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  accuracy: number | null;
  timestamp: string;
  direction: number | null;
}

export interface Photo {
  id: string;
  localUri: string;
  localUriWithOverlay?: string; // Photo with SoloCator-style overlay
  thumbnail?: string;
  metadata: PhotoMetadata;
  caption: string;
  projectId: string;
  createdAt: string;
  syncStatus: 'pending' | 'uploading' | 'synced' | 'error';
  syncedAt: string | null;
  remoteId: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface SyncStatus {
  pending: number;
  synced: number;
  error: number;
  lastSyncAt: string | null;
  isOnline: boolean;
}
