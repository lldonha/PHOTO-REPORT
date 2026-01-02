// Photo Processor - Create photos with SoloCator-style overlay

import { PhotoMetadata } from '../types/photo';
import { captureRef } from 'react-native-view-shot';
import { Directory, File, Paths } from 'expo-file-system';

export interface ProcessPhotoOptions {
    photoUri: string;
    photoId: string;
    metadata: PhotoMetadata;
    projectName: string;
    caption: string;
    overlayViewRef: any; // Reference to the overlay view
}

export async function processPhotoWithOverlay(options: ProcessPhotoOptions): Promise<string> {
    const { photoId, overlayViewRef } = options;

    try {
        // Capture the overlay view as image
        const overlayUri = await captureRef(overlayViewRef, {
            format: 'jpg',
            quality: 0.9,
        });

        // Save to photos directory
        const photosDir = new Directory(Paths.document, 'photos');
        if (!photosDir.exists) {
            await photosDir.create();
        }

        // Create destination file for photo with overlay
        const fileName = `photo_${photoId}_overlay.jpg`;
        const destFile = new File(photosDir, fileName);

        // Move captured overlay to final location
        const sourceFile = new File(overlayUri);
        await sourceFile.move(destFile);

        return destFile.uri;
    } catch (error) {
        console.error('Error processing photo with overlay:', error);
        throw error;
    }
}
