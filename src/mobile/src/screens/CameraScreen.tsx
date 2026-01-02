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
    TextInput,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Paths, Directory, File } from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { Photo, PhotoMetadata, Project } from '../types/photo';
import { savePhoto } from '../services/database';
import { getCurrentProject, updateCurrentProjectName } from '../services/projectManager';
import CompassOverlay from '../components/CompassOverlay';
import PhotoWithOverlayPreview from '../components/PhotoWithOverlayPreview';
import { processPhotoWithOverlay } from '../services/photoProcessor';

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

    // Project management
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [projectName, setProjectName] = useState('');

    // Description modal
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [description, setDescription] = useState('');
    const [capturedPhoto, setCapturedPhoto] = useState<{ photo: any; metadata: PhotoMetadata; localUri: string } | null>(null);

    // Compass heading
    const [heading, setHeading] = useState<number | null>(null);

    // Photo with overlay processing
    const overlayViewRef = useRef<View>(null);
    const [photoForOverlay, setPhotoForOverlay] = useState<{ uri: string; width: number; height: number } | null>(null);

    useEffect(() => {
        requestLocationPermission();
        startLocationWatch();
        loadCurrentProject();
        startHeadingWatch();
    }, []);

    const startHeadingWatch = () => {
        // Update heading every second
        const interval = setInterval(async () => {
            try {
                const headingData = await Location.getHeadingAsync();
                setHeading(headingData.trueHeading ?? headingData.magHeading ?? null);
            } catch (error) {
                console.log('Heading error:', error);
            }
        }, 1000);

        return () => clearInterval(interval);
    };

    const loadCurrentProject = async () => {
        try {
            const project = await getCurrentProject();
            setCurrentProject(project);
            setProjectName(project.name);
        } catch (error) {
            console.error('Error loading project:', error);
        }
    };

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

            // Store captured photo data and show description modal
            setCapturedPhoto({ photo, metadata, localUri });
            setDescription('');
            setShowDescriptionModal(true);
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

    const handleProjectNameChange = async (text: string) => {
        setProjectName(text);
    };

    const handleProjectNameBlur = async () => {
        if (projectName.trim() && projectName !== currentProject?.name) {
            try {
                const updated = await updateCurrentProjectName(projectName.trim());
                setCurrentProject(updated);
            } catch (error) {
                console.error('Error updating project name:', error);
            }
        }
    };

    const savePhotoWithDescription = async () => {
        if (!capturedPhoto || !currentProject) return;

        try {
            const photoId = generateId();

            // Setup photo for overlay rendering
            setPhotoForOverlay({
                uri: capturedPhoto.localUri,
                width: 1920, // Standard photo dimensions
                height: 1080,
            });

            // Wait for next frame to ensure view is rendered
            await new Promise(resolve => setTimeout(resolve, 100));

            // Process photo with overlay
            let overlayUri: string | undefined;
            try {
                if (overlayViewRef.current) {
                    overlayUri = await processPhotoWithOverlay({
                        photoUri: capturedPhoto.localUri,
                        photoId,
                        metadata: capturedPhoto.metadata,
                        projectName: currentProject.name,
                        caption: description.trim(),
                        overlayViewRef: overlayViewRef.current,
                    });
                }
            } catch (overlayError) {
                console.error('Error creating overlay:', overlayError);
                // Continue without overlay if it fails
            }

            // Create photo record
            const newPhoto: Photo = {
                id: photoId,
                localUri: capturedPhoto.localUri,
                localUriWithOverlay: overlayUri,
                metadata: capturedPhoto.metadata,
                caption: description.trim(),
                projectId: currentProject.id,
                createdAt: new Date().toISOString(),
                syncStatus: 'pending',
                syncedAt: null,
                remoteId: null,
            };

            // Save to database
            await savePhoto(newPhoto);

            // Notify parent
            onPhotoTaken?.(newPhoto);

            // Close modal and cleanup
            setShowDescriptionModal(false);
            setCapturedPhoto(null);
            setDescription('');
            setPhotoForOverlay(null);

            // Show brief success feedback
            Alert.alert('✅ Foto Salva!', undefined, [{ text: 'OK' }], { cancelable: true });
        } catch (error) {
            console.error('Error saving photo:', error);
            Alert.alert('Erro', 'Não foi possível salvar a foto');
        }
    };

    const skipDescription = async () => {
        // Save without description
        await savePhotoWithDescription();
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
            {/* Project Name Input */}
            <View style={styles.projectHeader}>
                <Ionicons name="folder-outline" size={20} color="#D4A574" />
                <TextInput
                    style={styles.projectInput}
                    value={projectName}
                    onChangeText={handleProjectNameChange}
                    onBlur={handleProjectNameBlur}
                    placeholder="Nome do Projeto"
                    placeholderTextColor="#666"
                />
            </View>

            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                {/* Compass Overlay */}
                {heading !== null && (
                    <View style={styles.compassOverlay}>
                        <CompassOverlay heading={heading} />
                    </View>
                )}

                {/* GPS Status indicator */}
                <View style={[styles.gpsIndicator, heading !== null && { top: 140 }]}>
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

            {/* Description Modal */}
            <Modal
                visible={showDescriptionModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDescriptionModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>📝 Adicionar Descrição</Text>

                        <TextInput
                            style={styles.descriptionInput}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Ex: Calçadas danificadas, Janelas quebradas..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={3}
                            maxLength={150}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.skipButton]}
                                onPress={skipDescription}
                            >
                                <Text style={styles.skipButtonText}>Pular</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={savePhotoWithDescription}
                            >
                                <Text style={styles.saveButtonText}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Hidden view for overlay processing */}
            {photoForOverlay && capturedPhoto && currentProject && (
                <PhotoWithOverlayPreview
                    ref={overlayViewRef}
                    photoUri={photoForOverlay.uri}
                    metadata={capturedPhoto.metadata}
                    projectName={currentProject.name}
                    caption={description.trim()}
                    width={photoForOverlay.width}
                    height={photoForOverlay.height}
                />
            )}
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
    compassOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
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
    projectHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1B3A5C',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#D4A574',
    },
    projectInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        backgroundColor: '#1B3A5C',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
    },
    descriptionInput: {
        backgroundColor: '#0F1F35',
        borderRadius: 12,
        padding: 16,
        color: 'white',
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        borderWidth: 2,
        borderColor: '#D4A574',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    skipButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    skipButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#D4A574',
    },
    saveButtonText: {
        color: '#0F1F35',
        fontSize: 16,
        fontWeight: '700',
    },
});
