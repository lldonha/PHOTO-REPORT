// Photo Filters - Filter photos by date, direction, and capture mode
// Sprint 2 feature: Organization by date and cardinal direction

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CaptureMode } from '../types/photo';

export type DateFilter = 'today' | 'week' | 'month' | 'all';
export type DirectionFilter = 'all' | 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';

interface Props {
    dateFilter: DateFilter;
    directionFilter: DirectionFilter;
    captureModeFilter: CaptureMode | 'all';
    onDateFilterChange: (filter: DateFilter) => void;
    onDirectionFilterChange: (filter: DirectionFilter) => void;
    onCaptureModeFilterChange: (filter: CaptureMode | 'all') => void;
    photoCounts?: {
        today: number;
        week: number;
        month: number;
        all: number;
    };
}

const DATE_FILTERS: { value: DateFilter; label: string; icon: string }[] = [
    { value: 'today', label: 'Hoje', icon: '📅' },
    { value: 'week', label: 'Semana', icon: '📆' },
    { value: 'month', label: 'Mês', icon: '🗓️' },
    { value: 'all', label: 'Todas', icon: '🌐' },
];

const DIRECTION_FILTERS: DirectionFilter[] = ['all', 'N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

const CAPTURE_MODE_FILTERS: { value: CaptureMode | 'all'; label: string; icon: string }[] = [
    { value: 'all', label: 'Todos', icon: '🌐' },
    { value: 'compass', label: 'Compass', icon: '🧭' },
    { value: 'building', label: 'Building', icon: '🏢' },
    { value: 'street', label: 'Street', icon: '🛣️' },
];

export default function PhotoFilters({
    dateFilter,
    directionFilter,
    captureModeFilter,
    onDateFilterChange,
    onDirectionFilterChange,
    onCaptureModeFilterChange,
    photoCounts,
}: Props) {
    return (
        <View style={styles.container}>
            {/* Date Filters */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Período</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {DATE_FILTERS.map((filter) => (
                        <TouchableOpacity
                            key={filter.value}
                            style={[
                                styles.filterButton,
                                dateFilter === filter.value && styles.filterButtonActive,
                            ]}
                            onPress={() => onDateFilterChange(filter.value)}
                        >
                            <Text style={styles.filterIcon}>{filter.icon}</Text>
                            <Text
                                style={[
                                    styles.filterLabel,
                                    dateFilter === filter.value && styles.filterLabelActive,
                                ]}
                            >
                                {filter.label}
                            </Text>
                            {photoCounts && photoCounts[filter.value] > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{photoCounts[filter.value]}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Direction Filters */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Direção Cardeal</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {DIRECTION_FILTERS.map((direction) => (
                        <TouchableOpacity
                            key={direction}
                            style={[
                                styles.directionButton,
                                directionFilter === direction && styles.directionButtonActive,
                            ]}
                            onPress={() => onDirectionFilterChange(direction)}
                        >
                            <Text
                                style={[
                                    styles.directionLabel,
                                    directionFilter === direction && styles.directionLabelActive,
                                ]}
                            >
                                {direction === 'all' ? '🌐' : direction}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Capture Mode Filters */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Modo de Captura</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {CAPTURE_MODE_FILTERS.map((mode) => (
                        <TouchableOpacity
                            key={mode.value}
                            style={[
                                styles.filterButton,
                                captureModeFilter === mode.value && styles.filterButtonActive,
                            ]}
                            onPress={() => onCaptureModeFilterChange(mode.value)}
                        >
                            <Text style={styles.filterIcon}>{mode.icon}</Text>
                            <Text
                                style={[
                                    styles.filterLabel,
                                    captureModeFilter === mode.value && styles.filterLabelActive,
                                ]}
                            >
                                {mode.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1B3A5C',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#D4A574',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 16,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    filterRow: {
        paddingHorizontal: 12,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginHorizontal: 4,
        gap: 6,
    },
    filterButtonActive: {
        backgroundColor: '#D4A574',
    },
    filterIcon: {
        fontSize: 14,
    },
    filterLabel: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    filterLabelActive: {
        color: '#1B3A5C',
    },
    badge: {
        backgroundColor: '#4ade80',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 4,
    },
    badgeText: {
        color: '#0F1F35',
        fontSize: 10,
        fontWeight: '700',
    },
    directionButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        marginHorizontal: 4,
    },
    directionButtonActive: {
        backgroundColor: '#D4A574',
    },
    directionLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
    directionLabelActive: {
        color: '#1B3A5C',
    },
});
