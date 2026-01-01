// Camera Screen - Capture photos with GPS metadata

import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Paths, Directory, File } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Photo, PhotoMetadata } from '../types/photo';
import { savePhoto, getDefaultProject } from '../services/database';

interface Props {
    onPhotoTaken?: (photo: Photo) => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

export default function CameraScreen({ onPhotoTaken }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const [locationPermission, setLocationPermission] = useState<boolean>(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [facing, setFacing] = useState<'front' | 'back'>('back');
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        requestLocationPermission();
        startLocationWatch();
    }, []);

    const requestLocationPermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
    };

    const startLocationWatch = async () => {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status === 'granted') {
                Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 5,
                    },
                    (loc) => setLocation(loc)
                );
            }
        } catch (error) {
            console.log('Location watch error:', error);
        }
    };

    const capturePhoto = async () => {
        if (!cameraRef.current || isCapturing) return;

        setIsCapturing(true);

        try {
            // Take photo
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.85,
                skipProcessing: false,
            });

            if (!photo?.uri) {
                throw new Error('Failed to capture photo');
            }

            // Get current location
            let currentLocation = location;
            if (locationPermission && !currentLocation) {
                try {
                    currentLocation = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                    });
                } catch (e) {
                    console.log('Could not get location:', e);
                }
            }

            // Get heading/direction
            let heading: number | null = null;
            try {
                const headingData = await Location.getHeadingAsync();
                heading = headingData.trueHeading ?? headingData.magHeading ?? null;
            } catch (e) {
                console.log('Could not get heading:', e);
            }

            // Create metadata
            const metadata: PhotoMetadata = {
                latitude: currentLocation?.coords.latitude ?? null,
                longitude: currentLocation?.coords.longitude ?? null,
                altitude: currentLocation?.coords.altitude ?? null,
                accuracy: currentLocation?.coords.accuracy ?? null,
                timestamp: new Date().toISOString(),
                direction: heading,
            };

            // Save to app's document directory using new API
            const photoId = generateId();
            const fileName = `photo_${photoId}.jpg`;

            // Create photos directory in document directory
            const photosDir = new Directory(Paths.document, 'photos');
            if (!photosDir.exists) {
                await photosDir.create();
            }

            // Create destination file
            const destFile = new File(photosDir, fileName);

            // Copy photo from temp location
            const sourceFile = new File(photo.uri);
            await sourceFile.move(destFile);

            const localUri = destFile.uri;

            // Get default project
            const project = await getDefaultProject();

            // Create photo record
            const newPhoto: Photo = {
                id: photoId,
                localUri,
                metadata,
                caption: '',
                projectId: project.id,
                createdAt: new Date().toISOString(),
                syncStatus: 'pending',
                syncedAt: null,
                remoteId: null,
            };

            // Save to database
            await savePhoto(newPhoto);

            // Notify parent
            onPhotoTaken?.(newPhoto);

            // Show feedback
            Alert.alert(
                '📸 Foto Salva!',
                `GPS: ${metadata.latitude ? 'Capturado' : 'Não disponível'}\nDireção: ${metadata.direction ? `${Math.round(metadata.direction)}°` : 'N/A'
                }`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Capture error:', error);
            Alert.alert('Erro', 'Não foi possível capturar a foto');
        } finally {
            setIsCapturing(false);
        }
    };

    const toggleFacing = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    // Permission not determined yet
    if (!permission) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#D4A574" />
            </View>
        );
    }

    // Permission denied
    if (!permission.granted) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.permissionContainer}>
                    <Ionicons name="camera-outline" size={64} color="#D4A574" />
                    <Text style={styles.permissionText}>
                        Precisamos de acesso à câmera para capturar fotos da obra
                    </Text>
                    <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                        <Text style={styles.permissionButtonText}>Permitir Câmera</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                {/* GPS Status indicator */}
                <View style={styles.gpsIndicator}>
                    <Ionicons
                        name={location ? 'location' : 'location-outline'}
                        size={20}
                        color={location ? '#4ade80' : '#fbbf24'}
                    />
                    <Text style={styles.gpsText}>
                        {location
                            ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
                            : 'Aguardando GPS...'}
                    </Text>
                </View>

                {/* Controls */}
                <View style={styles.controls}>
                    {/* Flip camera */}
                    <TouchableOpacity style={styles.controlButton} onPress={toggleFacing}>
                        <Ionicons name="camera-reverse-outline" size={32} color="white" />
                    </TouchableOpacity>

                    {/* Capture button */}
                    <TouchableOpacity
                        style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
                        onPress={capturePhoto}
                        disabled={isCapturing}
                    >
                        {isCapturing ? (
                            <ActivityIndicator size="large" color="#1B3A5C" />
                        ) : (
                            <View style={styles.captureButtonInner} />
                        )}
                    </TouchableOpacity>

                    {/* Placeholder for symmetry */}
                    <View style={styles.controlButton} />
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1F35',
    },
    camera: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    permissionText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    permissionButton: {
        backgroundColor: '#D4A574',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#0F1F35',
        fontSize: 16,
        fontWeight: '700',
    },
    gpsIndicator: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    gpsText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'monospace',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#D4A574',
    },
    captureButtonDisabled: {
        opacity: 0.7,
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#D4A574',
    },
});
