// Export Service - Handle ZIP and KML/KMZ exports

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import JSZip from 'jszip';
import { Photo } from '../types/photo';

interface ExportOptions {
    includeOriginal?: boolean;
    includeOverlay?: boolean;
    includeMetadata?: boolean;
}

/**
 * Export photos as a ZIP file
 */
export async function exportPhotosAsZip(
    photos: Photo[],
    options: ExportOptions = {
        includeOriginal: true,
        includeOverlay: true,
        includeMetadata: true
    }
): Promise<void> {
    if (photos.length === 0) {
        throw new Error('No photos to export');
    }

    try {
        const zip = new JSZip();
        const photoFolder = zip.folder('photos');

        if (!photoFolder) {
            throw new Error('Failed to create photos folder in ZIP');
        }

        // Group photos by project for better organization
        const photosByProject: { [key: string]: Photo[] } = {};
        photos.forEach(photo => {
            const projectId = photo.projectId || 'sem-projeto';
            if (!photosByProject[projectId]) {
                photosByProject[projectId] = [];
            }
            photosByProject[projectId].push(photo);
        });

        // Add photos to ZIP
        let photoIndex = 1;
        for (const [projectId, projectPhotos] of Object.entries(photosByProject)) {
            const projectFolder = photoFolder.folder(projectId);
            if (!projectFolder) continue;

            for (const photo of projectPhotos) {
                const timestamp = new Date(photo.metadata.timestamp);
                const dateStr = timestamp.toISOString().split('T')[0];
                const timeStr = timestamp.toTimeString().split(' ')[0].replace(/:/g, '-');
                const baseName = `${dateStr}_${timeStr}_${photoIndex}`;

                // Add original photo
                if (options.includeOriginal && photo.localUri) {
                    try {
                        const fileContent = await FileSystem.readAsStringAsync(
                            photo.localUri,
                            { encoding: FileSystem.EncodingType.Base64 }
                        );
                        projectFolder.file(`${baseName}_original.jpg`, fileContent, { base64: true });
                    } catch (error) {
                        console.error(`Failed to read original photo ${photo.id}:`, error);
                    }
                }

                // Add overlay photo
                if (options.includeOverlay && photo.localUriWithOverlay) {
                    try {
                        const fileContent = await FileSystem.readAsStringAsync(
                            photo.localUriWithOverlay,
                            { encoding: FileSystem.EncodingType.Base64 }
                        );
                        projectFolder.file(`${baseName}_overlay.jpg`, fileContent, { base64: true });
                    } catch (error) {
                        console.error(`Failed to read overlay photo ${photo.id}:`, error);
                    }
                }

                photoIndex++;
            }
        }

        // Add metadata JSON if requested
        if (options.includeMetadata) {
            const metadata = {
                exportDate: new Date().toISOString(),
                totalPhotos: photos.length,
                projects: Object.keys(photosByProject).length,
                photos: photos.map(photo => ({
                    id: photo.id,
                    timestamp: photo.metadata.timestamp,
                    location: {
                        latitude: photo.metadata.latitude,
                        longitude: photo.metadata.longitude,
                        altitude: photo.metadata.altitude,
                        accuracy: photo.metadata.accuracy
                    },
                    direction: photo.metadata.direction,
                    captureMode: photo.metadata.captureMode,
                    caption: photo.caption,
                    projectId: photo.projectId
                }))
            };
            zip.file('metadata.json', JSON.stringify(metadata, null, 2));
        }

        // Generate ZIP file
        const zipContent = await zip.generateAsync({
            type: 'base64',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });

        // Save to file system
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const fileName = `photo-report-export-${timestamp}.zip`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, zipContent, {
            encoding: FileSystem.EncodingType.Base64
        });

        // Share the file
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/zip',
                dialogTitle: 'Exportar fotos',
                UTI: 'public.zip-archive'
            });
        } else {
            throw new Error('Sharing is not available on this device');
        }

        // Clean up temporary file after a delay
        setTimeout(async () => {
            try {
                await FileSystem.deleteAsync(fileUri, { idempotent: true });
            } catch (error) {
                console.error('Failed to delete temporary ZIP file:', error);
            }
        }, 60000); // Delete after 1 minute

    } catch (error) {
        console.error('Error exporting photos as ZIP:', error);
        throw error;
    }
}

/**
 * Export photos as KML file for Google Earth
 */
export async function exportPhotosAsKML(photos: Photo[]): Promise<void> {
    if (photos.length === 0) {
        throw new Error('No photos to export');
    }

    try {
        // Filter photos that have GPS coordinates
        const photosWithGPS = photos.filter(p =>
            p.metadata.latitude !== null &&
            p.metadata.longitude !== null
        );

        if (photosWithGPS.length === 0) {
            throw new Error('No photos with GPS coordinates to export');
        }

        // Generate KML content
        const kml = generateKML(photosWithGPS);

        // Save to file system
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const fileName = `photo-report-export-${timestamp}.kml`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, kml, {
            encoding: FileSystem.EncodingType.UTF8
        });

        // Share the file
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/vnd.google-earth.kml+xml',
                dialogTitle: 'Exportar para Google Earth'
            });
        } else {
            throw new Error('Sharing is not available on this device');
        }

        // Clean up temporary file after a delay
        setTimeout(async () => {
            try {
                await FileSystem.deleteAsync(fileUri, { idempotent: true });
            } catch (error) {
                console.error('Failed to delete temporary KML file:', error);
            }
        }, 60000);

    } catch (error) {
        console.error('Error exporting photos as KML:', error);
        throw error;
    }
}

/**
 * Export photos as KMZ file (KML + embedded images) for Google Earth
 */
export async function exportPhotosAsKMZ(photos: Photo[]): Promise<void> {
    if (photos.length === 0) {
        throw new Error('No photos to export');
    }

    try {
        const photosWithGPS = photos.filter(p =>
            p.metadata.latitude !== null &&
            p.metadata.longitude !== null
        );

        if (photosWithGPS.length === 0) {
            throw new Error('No photos with GPS coordinates to export');
        }

        const zip = new JSZip();

        // Add KML file
        const kml = generateKML(photosWithGPS, true); // true = KMZ mode
        zip.file('doc.kml', kml);

        // Add photos
        const filesFolder = zip.folder('files');
        if (!filesFolder) {
            throw new Error('Failed to create files folder in KMZ');
        }

        for (let i = 0; i < photosWithGPS.length; i++) {
            const photo = photosWithGPS[i];
            const photoUri = photo.localUriWithOverlay || photo.localUri;

            try {
                const fileContent = await FileSystem.readAsStringAsync(
                    photoUri,
                    { encoding: FileSystem.EncodingType.Base64 }
                );
                filesFolder.file(`photo_${i + 1}.jpg`, fileContent, { base64: true });
            } catch (error) {
                console.error(`Failed to read photo ${photo.id}:`, error);
            }
        }

        // Generate KMZ file
        const kmzContent = await zip.generateAsync({
            type: 'base64',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });

        // Save to file system
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const fileName = `photo-report-export-${timestamp}.kmz`;
        const fileUri = `${FileSystem.cacheDirectory}${fileName}`;

        await FileSystem.writeAsStringAsync(fileUri, kmzContent, {
            encoding: FileSystem.EncodingType.Base64
        });

        // Share the file
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
            await Sharing.shareAsync(fileUri, {
                mimeType: 'application/vnd.google-earth.kmz',
                dialogTitle: 'Exportar para Google Earth'
            });
        } else {
            throw new Error('Sharing is not available on this device');
        }

        // Clean up temporary file after a delay
        setTimeout(async () => {
            try {
                await FileSystem.deleteAsync(fileUri, { idempotent: true });
            } catch (error) {
                console.error('Failed to delete temporary KMZ file:', error);
            }
        }, 60000);

    } catch (error) {
        console.error('Error exporting photos as KMZ:', error);
        throw error;
    }
}

/**
 * Generate KML XML content
 */
function generateKML(photos: Photo[], isKMZ: boolean = false): string {
    const getCardinalDirection = (degrees: number | null): string => {
        if (degrees === null) return 'Unknown';
        const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return cardinals[index];
    };

    const placemarks = photos.map((photo, index) => {
        const timestamp = new Date(photo.metadata.timestamp).toLocaleString('pt-BR');
        const direction = getCardinalDirection(photo.metadata.direction);
        const caption = photo.caption || 'Sem legenda';

        const imagePath = isKMZ ? `files/photo_${index + 1}.jpg` : '';
        const imageHtml = isKMZ
            ? `<br/><img src="${imagePath}" width="400" alt="Photo"/>`
            : '';

        return `
    <Placemark>
      <name>${photo.id}</name>
      <description><![CDATA[
        <b>Data:</b> ${timestamp}<br/>
        <b>Direção:</b> ${direction} (${Math.round(photo.metadata.direction || 0)}°)<br/>
        <b>Altitude:</b> ${photo.metadata.altitude?.toFixed(1) || 'N/A'} m<br/>
        <b>Precisão:</b> ${photo.metadata.accuracy?.toFixed(1) || 'N/A'} m<br/>
        <b>Modo:</b> ${photo.metadata.captureMode || 'N/A'}<br/>
        <b>Legenda:</b> ${caption}${imageHtml}
      ]]></description>
      <Point>
        <coordinates>${photo.metadata.longitude},${photo.metadata.latitude},${photo.metadata.altitude || 0}</coordinates>
      </Point>
    </Placemark>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Photo Report Export</name>
    <description>Exported photos with GPS coordinates</description>
    ${placemarks}
  </Document>
</kml>`;
}

/**
 * Get export statistics
 */
export function getExportStats(photos: Photo[]): {
    total: number;
    withGPS: number;
    withOverlay: number;
    estimatedSizeMB: number;
} {
    const withGPS = photos.filter(p =>
        p.metadata.latitude !== null &&
        p.metadata.longitude !== null
    ).length;

    const withOverlay = photos.filter(p =>
        p.localUriWithOverlay !== null
    ).length;

    // Rough estimate: ~2-3 MB per photo (original + overlay)
    const estimatedSizeMB = photos.length * 2.5;

    return {
        total: photos.length,
        withGPS,
        withOverlay,
        estimatedSizeMB
    };
}
