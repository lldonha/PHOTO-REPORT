// Capture Mode Selector - Switch between Compass, Building, and Street modes
// Based on SoloCator's capture mode system

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CaptureMode } from '../types/photo';

interface Props {
    currentMode: CaptureMode;
    onModeChange: (mode: CaptureMode) => void;
}

const MODES: { mode: CaptureMode; label: string; icon: string }[] = [
    { mode: 'compass', label: 'Compass', icon: '🧭' },
    { mode: 'building', label: 'Building', icon: '🏢' },
    { mode: 'street', label: 'Street', icon: '🛣️' },
];

export default function CaptureModeSelector({ currentMode, onModeChange }: Props) {
    return (
        <View style={styles.container}>
            {MODES.map(({ mode, label, icon }) => (
                <TouchableOpacity
                    key={mode}
                    style={[
                        styles.modeButton,
                        currentMode === mode && styles.modeButtonActive,
                    ]}
                    onPress={() => onModeChange(mode)}
                >
                    <Text style={styles.modeIcon}>{icon}</Text>
                    <Text
                        style={[
                            styles.modeLabel,
                            currentMode === mode && styles.modeLabelActive,
                        ]}
                    >
                        {label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 8,
        padding: 4,
        gap: 4,
    },
    modeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        gap: 6,
    },
    modeButtonActive: {
        backgroundColor: '#D4A574',
    },
    modeIcon: {
        fontSize: 16,
    },
    modeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    modeLabelActive: {
        color: '#1B3A5C',
    },
});
