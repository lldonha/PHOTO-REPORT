// Gallery Screen - View and manage captured photos

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    Alert,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../types/photo';
import { getPhotos, updatePhotoCaption, deletePhoto } from '../services/database';
import PhotoFilters, { DateFilter, DirectionFilter } from '../components/PhotoFilters';
import { CaptureMode } from '../types/photo';

interface Props {
    refreshTrigger?: number;
}

export default function GalleryScreen({ refreshTrigger }: Props) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editCaption, setEditCaption] = useState('');

    // Filter states
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');
    const [captureModeFilter, setCaptureModeFilter] = useState<CaptureMode | 'all'>('all');

    const loadPhotos = useCallback(async () => {
        try {
            const loadedPhotos = await getPhotos();
            setPhotos(loadedPhotos);
        } catch (error) {
            console.error('Error loading photos:', error);
        }
    }, []);

    useEffect(() => {
        loadPhotos();
    }, [loadPhotos, refreshTrigger]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadPhotos();
        setRefreshing(false);
    };

    const handleEditCaption = (photo: Photo) => {
        setEditingId(photo.id);
        setEditCaption(photo.caption);
    };

    const handleSaveCaption = async () => {
        if (editingId) {
            await updatePhotoCaption(editingId, editCaption);
            setEditingId(null);
            setEditCaption('');
            loadPhotos();
        }
    };

    const handleDelete = (photo: Photo) => {
        Alert.alert(
            'Excluir Foto',
            'Tem certeza que deseja excluir esta foto?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        await deletePhoto(photo.id);
                        loadPhotos();
                    },
                },
            ]
        );
    };

    // Helper functions for filtering
    const getCardinalDirection = (degrees: number | null): DirectionFilter | null => {
        if (degrees === null) return null;
        const cardinals: DirectionFilter[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(degrees / 45) % 8;
        return cardinals[index];
    };

    const isWithinDateRange = (timestamp: string, filter: DateFilter): boolean => {
        const photoDate = new Date(timestamp);
        const now = new Date();
        const diffTime = now.getTime() - photoDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        switch (filter) {
            case 'today':
                return diffDays < 1;
            case 'week':
                return diffDays < 7;
            case 'month':
                return diffDays < 30;
            case 'all':
                return true;
            default:
                return true;
        }
    };

    // Filtered photos
    const filteredPhotos = useMemo(() => {
        return photos.filter((photo) => {
            // Date filter
            if (!isWithinDateRange(photo.metadata.timestamp, dateFilter)) {
                return false;
            }

            // Direction filter
            if (directionFilter !== 'all') {
                const photoDirection = getCardinalDirection(photo.metadata.direction);
                if (photoDirection !== directionFilter) {
                    return false;
                }
            }

            // Capture mode filter
            if (captureModeFilter !== 'all') {
                if (photo.metadata.captureMode !== captureModeFilter) {
                    return false;
                }
            }

            return true;
        });
    }, [photos, dateFilter, directionFilter, captureModeFilter]);

    // Photo counts for filter badges
    const photoCounts = useMemo(() => {
        return {
            today: photos.filter((p) => isWithinDateRange(p.metadata.timestamp, 'today')).length,
            week: photos.filter((p) => isWithinDateRange(p.metadata.timestamp, 'week')).length,
            month: photos.filter((p) => isWithinDateRange(p.metadata.timestamp, 'month')).length,
            all: photos.length,
        };
    }, [photos]);

    const getSyncIcon = (status: Photo['syncStatus']) => {
        switch (status) {
            case 'synced':
                return { name: 'cloud-done' as const, color: '#4ade80' };
            case 'uploading':
                return { name: 'cloud-upload' as const, color: '#fbbf24' };
            case 'error':
                return { name: 'cloud-offline' as const, color: '#ef4444' };
            default:
                return { name: 'cloud-outline' as const, color: '#9ca3af' };
        }
    };

    const renderPhoto = ({ item }: { item: Photo }) => {
        const syncIcon = getSyncIcon(item.syncStatus);
        const isEditing = editingId === item.id;

        return (
            <View style={styles.photoCard}>
                <Image source={{ uri: item.localUri }} style={styles.photoImage} />

                {/* Sync status badge */}
                <View style={styles.syncBadge}>
                    <Ionicons name={syncIcon.name} size={16} color={syncIcon.color} />
                </View>

                {/* Metadata */}
                <View style={styles.metadata}>
                    <Text style={styles.timestamp}>
                        📅 {new Date(item.metadata.timestamp).toLocaleString('pt-BR')}
                    </Text>
                    {item.metadata.latitude && (
                        <Text style={styles.location}>
                            📍 {item.metadata.latitude.toFixed(4)}, {item.metadata.longitude?.toFixed(4)}
                        </Text>
                    )}
                    {item.metadata.direction && (
                        <Text style={styles.direction}>
                            🧭 {Math.round(item.metadata.direction)}°
                        </Text>
                    )}
                </View>

                {/* Caption */}
                <View style={styles.captionContainer}>
                    {isEditing ? (
                        <View style={styles.editContainer}>
                            <TextInput
                                style={styles.captionInput}
                                value={editCaption}
                                onChangeText={setEditCaption}
                                placeholder="Adicionar legenda..."
                                placeholderTextColor="#9ca3af"
                                multiline
                            />
                            <View style={styles.editButtons}>
                                <TouchableOpacity onPress={() => setEditingId(null)}>
                                    <Ionicons name="close" size={24} color="#ef4444" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSaveCaption}>
                                    <Ionicons name="checkmark" size={24} color="#4ade80" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={() => handleEditCaption(item)} style={styles.captionTouchable}>
                            <Text style={[styles.caption, !item.caption && styles.captionPlaceholder]}>
                                {item.caption || 'Toque para adicionar legenda...'}
                            </Text>
                            <Ionicons name="pencil" size={16} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Galeria</Text>
                <Text style={styles.headerCount}>
                    {filteredPhotos.length} {filteredPhotos.length !== photos.length && `de ${photos.length}`} fotos
                </Text>
            </View>

            {/* Filters */}
            <PhotoFilters
                dateFilter={dateFilter}
                directionFilter={directionFilter}
                captureModeFilter={captureModeFilter}
                onDateFilterChange={setDateFilter}
                onDirectionFilterChange={setDirectionFilter}
                onCaptureModeFilterChange={setCaptureModeFilter}
                photoCounts={photoCounts}
            />

            {photos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="images-outline" size={64} color="#4a5568" />
                    <Text style={styles.emptyText}>Nenhuma foto capturada</Text>
                    <Text style={styles.emptySubtext}>Use a câmera para tirar fotos da obra</Text>
                </View>
            ) : filteredPhotos.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="filter-outline" size={64} color="#4a5568" />
                    <Text style={styles.emptyText}>Nenhuma foto encontrada</Text>
                    <Text style={styles.emptySubtext}>Ajuste os filtros para ver mais fotos</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPhotos}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPhoto}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#D4A574"
                        />
                    }
                />
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
    list: {
        padding: 16,
        gap: 16,
    },
    photoCard: {
        backgroundColor: '#1B3A5C',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    photoImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    syncBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
    },
    metadata: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    timestamp: {
        color: '#D4A574',
        fontSize: 12,
        marginBottom: 4,
    },
    location: {
        color: '#9ca3af',
        fontSize: 12,
        fontFamily: 'monospace',
    },
    direction: {
        color: '#9ca3af',
        fontSize: 12,
    },
    captionContainer: {
        padding: 12,
    },
    captionTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    caption: {
        color: 'white',
        fontSize: 14,
        flex: 1,
    },
    captionPlaceholder: {
        color: '#6b7280',
        fontStyle: 'italic',
    },
    editContainer: {
        gap: 8,
    },
    captionInput: {
        backgroundColor: '#0F1F35',
        color: 'white',
        padding: 12,
        borderRadius: 8,
        fontSize: 14,
        minHeight: 60,
    },
    editButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    deleteButton: {
        padding: 8,
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
});
