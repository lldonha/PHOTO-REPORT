// Sync Screen - View sync status and manually trigger sync

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SyncStatus } from '../types/photo';
import { getSyncStatus } from '../services/database';
import { syncAllPending, checkConnection } from '../services/syncService';

interface Props {
    refreshTrigger?: number;
}

export default function SyncScreen({ refreshTrigger }: Props) {
    const [status, setStatus] = useState<SyncStatus | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
    const [refreshing, setRefreshing] = useState(false);

    const loadStatus = useCallback(async () => {
        try {
            const syncStatus = await getSyncStatus();
            const isOnline = await checkConnection();
            setStatus({ ...syncStatus, isOnline });
        } catch (error) {
            console.error('Error loading sync status:', error);
        }
    }, []);

    useEffect(() => {
        loadStatus();
    }, [loadStatus, refreshTrigger]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStatus();
        setRefreshing(false);
    };

    const handleSync = async () => {
        if (isSyncing) return;

        setIsSyncing(true);
        setSyncProgress({ current: 0, total: status?.pending || 0 });

        try {
            const result = await syncAllPending((current, total) => {
                setSyncProgress({ current, total });
            });

            await loadStatus();

            if (result.synced > 0) {
                // Could show a toast here
                console.log(`Synced ${result.synced} photos`);
            }
        } catch (error) {
            console.error('Sync error:', error);
        } finally {
            setIsSyncing(false);
            setSyncProgress({ current: 0, total: 0 });
        }
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Nunca';
        return new Date(dateStr).toLocaleString('pt-BR');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#D4A574"
                    />
                }
            >
                {/* Connection Status */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons
                            name={status?.isOnline ? 'wifi' : 'wifi-outline'}
                            size={24}
                            color={status?.isOnline ? '#4ade80' : '#ef4444'}
                        />
                        <Text style={styles.cardTitle}>Conexão</Text>
                    </View>
                    <Text style={[styles.statusText, { color: status?.isOnline ? '#4ade80' : '#ef4444' }]}>
                        {status?.isOnline ? 'Online' : 'Offline'}
                    </Text>
                    {!status?.isOnline && (
                        <Text style={styles.helperText}>
                            As fotos serão sincronizadas quando houver conexão
                        </Text>
                    )}
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { borderColor: '#fbbf24' }]}>
                        <Text style={styles.statNumber}>{status?.pending || 0}</Text>
                        <Text style={styles.statLabel}>Pendentes</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: '#4ade80' }]}>
                        <Text style={styles.statNumber}>{status?.synced || 0}</Text>
                        <Text style={styles.statLabel}>Sincronizadas</Text>
                    </View>
                    <View style={[styles.statCard, { borderColor: '#ef4444' }]}>
                        <Text style={styles.statNumber}>{status?.error || 0}</Text>
                        <Text style={styles.statLabel}>Erros</Text>
                    </View>
                </View>

                {/* Last Sync */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="time-outline" size={24} color="#D4A574" />
                        <Text style={styles.cardTitle}>Última Sincronização</Text>
                    </View>
                    <Text style={styles.lastSyncText}>{formatDate(status?.lastSyncAt || null)}</Text>
                </View>

                {/* Sync Button */}
                <TouchableOpacity
                    style={[
                        styles.syncButton,
                        (!status?.isOnline || status?.pending === 0) && styles.syncButtonDisabled,
                    ]}
                    onPress={handleSync}
                    disabled={!status?.isOnline || status?.pending === 0 || isSyncing}
                >
                    {isSyncing ? (
                        <>
                            <Ionicons name="sync" size={24} color="white" />
                            <Text style={styles.syncButtonText}>
                                Sincronizando... {syncProgress.current}/{syncProgress.total}
                            </Text>
                        </>
                    ) : (
                        <>
                            <Ionicons name="cloud-upload-outline" size={24} color="white" />
                            <Text style={styles.syncButtonText}>
                                {status?.pending
                                    ? `Sincronizar ${status.pending} Foto${status.pending > 1 ? 's' : ''}`
                                    : 'Tudo Sincronizado'}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Info */}
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={20} color="#9ca3af" />
                    <Text style={styles.infoText}>
                        Fotos capturadas são salvas localmente e sincronizadas automaticamente quando
                        houver conexão com a internet.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1F35',
    },
    content: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: '#1B3A5C',
        borderRadius: 12,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    statusText: {
        fontSize: 24,
        fontWeight: '700',
    },
    helperText: {
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#1B3A5C',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderLeftWidth: 4,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: 'white',
    },
    statLabel: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
    },
    lastSyncText: {
        color: '#D4A574',
        fontSize: 16,
    },
    syncButton: {
        backgroundColor: '#D4A574',
        borderRadius: 12,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    syncButtonDisabled: {
        opacity: 0.5,
    },
    syncButtonText: {
        color: '#0F1F35',
        fontSize: 16,
        fontWeight: '700',
    },
    infoCard: {
        backgroundColor: 'rgba(27, 58, 92, 0.5)',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        gap: 12,
    },
    infoText: {
        flex: 1,
        color: '#9ca3af',
        fontSize: 13,
        lineHeight: 20,
    },
});
