// Sync Service - Upload photos to backend API

import { File } from 'expo-file-system';
import { Photo } from '../types/photo';
import { getPendingPhotos, updatePhotoSyncStatus } from './database';

const API_BASE_URL = 'https://api.lldonha.com';

interface UploadResult {
    success: boolean;
    remoteId?: string;
    error?: string;
}

export async function uploadPhoto(photo: Photo): Promise<UploadResult> {
    try {
        // Update status to uploading
        await updatePhotoSyncStatus(photo.id, 'uploading');

        // Read file as base64 using new File API
        const file = new File(photo.localUri);
        const base64 = await file.base64();

        // Upload to API
        const response = await fetch(`${API_BASE_URL}/mobile/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image_base64: base64,
                metadata: {
                    latitude: photo.metadata.latitude,
                    longitude: photo.metadata.longitude,
                    altitude: photo.metadata.altitude,
                    accuracy: photo.metadata.accuracy,
                    timestamp: photo.metadata.timestamp,
                    direction: photo.metadata.direction
                },
                caption: photo.caption,
                project_id: photo.projectId,
                local_id: photo.id
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const result = await response.json();

        // Update status to synced
        await updatePhotoSyncStatus(photo.id, 'synced', result.id);

        return { success: true, remoteId: result.id };
    } catch (error) {
        console.error('Upload error:', error);
        await updatePhotoSyncStatus(photo.id, 'error');
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function syncAllPending(
    onProgress?: (current: number, total: number) => void
): Promise<{ synced: number; failed: number }> {
    const pending = await getPendingPhotos();
    let synced = 0;
    let failed = 0;

    for (let i = 0; i < pending.length; i++) {
        const photo = pending[i];
        onProgress?.(i + 1, pending.length);

        const result = await uploadPhoto(photo);
        if (result.success) {
            synced++;
        } else {
            failed++;
        }

        // Small delay between uploads
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    return { synced, failed };
}

export async function checkConnection(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        return response.ok;
    } catch {
        return false;
    }
}
