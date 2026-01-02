// Map Screen - View photos on a map with GPS locations
// Sprint 2 feature: Map visualization with pins

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Modal,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../types/photo';
import { getPhotos } from '../services/database';

interface Props {
    refreshTrigger?: number;
}

export default function MapScreen({ refreshTrigger }: Props) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
    const [region, setRegion] = useState<Region | undefined>(undefined);
    const mapRef = useRef<MapView>(null);

    const loadPhotos = useCallback(async () => {
        try {
            const loadedPhotos = await getPhotos();
            const photosWithGPS = loadedPhotos.filter(
                (p) => p.metadata.latitude !== null && p.metadata.longitude !== null
            );
            setPhotos(photosWithGPS);

            // Center map on photos
            if (photosWithGPS.length > 0) {
                const latitudes = photosWithGPS.map((p) => p.metadata.latitude!);
                const longitudes = photosWithGPS.map((p) => p.metadata.longitude!);

                const minLat = Math.min(...latitudes);
                const maxLat = Math.max(...latitudes);
                const minLng = Math.min(...longitudes);
                const maxLng = Math.max(...longitudes);

                const centerLat = (minLat + maxLat) / 2;
                const centerLng = (minLng + maxLng) / 2;
                const latDelta = (maxLat - minLat) * 1.5 || 0.01; // Add padding
                const lngDelta = (maxLng - minLng) * 1.5 || 0.01;

                setRegion({
                    latitude: centerLat,
                    longitude: centerLng,
                    latitudeDelta: latDelta,
                    longitudeDelta: lngDelta,
                });
            }
        } catch (error) {
            console.error('Error loading photos:', error);
        }
    }, []);

    useEffect(() => {
        loadPhotos();
    }, [loadPhotos, refreshTrigger]);

    const getMarkerColor = (direction: number | null): string => {
        if (direction === null) return '#D4A574'; // Default gold

        // Color based on cardinal direction
        const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const colors = [
            '#ef4444', // N - Red
            '#f97316', // NE - Orange
            '#eab308', // E - Yellow
            '#84cc16', // SE - Lime
            '#22c55e', // S - Green
            '#14b8a6', // SW - Teal
            '#3b82f6', // W - Blue
            '#8b5cf6', // NW - Purple
        ];

        const index = Math.round(direction / 45) % 8;
        return colors[index];
    };

    const getCardinalDirection = (degrees: number | null): string => {
        if (degrees === null) return '?';
        const cardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return cardinals[index];
    };

    const handleMarkerPress = (photo: Photo) => {
        setSelectedPhoto(photo);
    };

    const handleCenterOnPhoto = (photo: Photo) => {
        if (photo.metadata.latitude && photo.metadata.longitude && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: photo.metadata.latitude,
                longitude: photo.metadata.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        }
        setSelectedPhoto(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mapa</Text>
                <Text style={styles.headerCount}>{photos.length} fotos com GPS</Text>
            </View>

            {photos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="location-outline" size={64} color="#4a5568" />
                    <Text style={styles.emptyText}>Nenhuma foto com localização</Text>
                    <Text style={styles.emptySubtext}>As fotos aparecerão aqui quando tiverem GPS</Text>
                </View>
            ) : (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    showsUserLocation
                    showsMyLocationButton
                    showsCompass
                    showsScale
                >
                    {photos.map((photo) => (
                        <Marker
                            key={photo.id}
                            coordinate={{
                                latitude: photo.metadata.latitude!,
                                longitude: photo.metadata.longitude!,
                            }}
                            onPress={() => handleMarkerPress(photo)}
                            pinColor={getMarkerColor(photo.metadata.direction)}
                        >
                            <View style={styles.markerContainer}>
                                <View
                                    style={[
                                        styles.markerInner,
                                        { backgroundColor: getMarkerColor(photo.metadata.direction) },
                                    ]}
                                >
                                    <Text style={styles.markerText}>
                                        {getCardinalDirection(photo.metadata.direction)}
                                    </Text>
                                </View>
                            </View>
                        </Marker>
                    ))}
                </MapView>
            )}

            {/* Photo Detail Modal */}
            {selectedPhoto && (
                <Modal
                    visible={true}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setSelectedPhoto(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {/* Photo */}
                            <Image
                                source={{ uri: selectedPhoto.localUri }}
                                style={styles.modalImage}
                            />

                            {/* Metadata */}
                            <View style={styles.modalMetadata}>
                                <Text style={styles.modalDate}>
                                    📅 {new Date(selectedPhoto.metadata.timestamp).toLocaleString('pt-BR')}
                                </Text>
                                {selectedPhoto.metadata.latitude && (
                                    <Text style={styles.modalLocation}>
                                        📍 {selectedPhoto.metadata.latitude.toFixed(6)},{' '}
                                        {selectedPhoto.metadata.longitude?.toFixed(6)}
                                    </Text>
                                )}
                                {selectedPhoto.metadata.direction !== null && (
                                    <Text style={styles.modalDirection}>
                                        🧭 {Math.round(selectedPhoto.metadata.direction)}°{' '}
                                        {getCardinalDirection(selectedPhoto.metadata.direction)}
                                    </Text>
                                )}
                                {selectedPhoto.metadata.altitude !== null && (
                                    <Text style={styles.modalAltitude}>
                                        ▲ {Math.round(selectedPhoto.metadata.altitude)}m
                                    </Text>
                                )}
                                {selectedPhoto.caption && (
                                    <Text style={styles.modalCaption}>{selectedPhoto.caption}</Text>
                                )}
                            </View>

                            {/* Actions */}
                            <View style={styles.modalActions}>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => handleCenterOnPhoto(selectedPhoto)}
                                >
                                    <Ionicons name="navigate-outline" size={20} color="white" />
                                    <Text style={styles.modalButtonText}>Centralizar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.modalButtonClose]}
                                    onPress={() => setSelectedPhoto(null)}
                                >
                                    <Ionicons name="close" size={20} color="white" />
                                    <Text style={styles.modalButtonText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1F35',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1B3A5C',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: 'white',
    },
    headerCount: {
        fontSize: 14,
        color: '#D4A574',
    },
    map: {
        flex: 1,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptySubtext: {
        color: '#6b7280',
        fontSize: 14,
        marginTop: 8,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerInner: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    markerText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1B3A5C',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalImage: {
        width: '100%',
        height: 250,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalMetadata: {
        padding: 16,
        gap: 8,
    },
    modalDate: {
        color: '#D4A574',
        fontSize: 14,
        fontWeight: '600',
    },
    modalLocation: {
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'monospace',
    },
    modalDirection: {
        color: '#9ca3af',
        fontSize: 12,
    },
    modalAltitude: {
        color: '#9ca3af',
        fontSize: 12,
    },
    modalCaption: {
        color: 'white',
        fontSize: 14,
        marginTop: 8,
    },
    modalActions: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
    },
    modalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D4A574',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    modalButtonClose: {
        backgroundColor: '#ef4444',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
