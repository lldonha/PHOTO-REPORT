// Compass Overlay - SoloCator-style compass ruler with cardinal directions

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    heading: number | null; // Heading in degrees (0-360)
}

// Convert degrees to cardinal direction
const degreesToCardinal = (degrees: number): string => {
    const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return cardinals[index];
};

export default function CompassOverlay({ heading }: Props) {
    if (heading === null) return null;

    // Normalize heading to 0-360
    const normalizedHeading = ((heading % 360) + 360) % 360;

    // Generate ruler ticks (every 30 degrees)
    const renderRuler = () => {
        const ticks = [];
        const visibleRange = 180; // Show 180 degrees of compass
        const centerDegree = normalizedHeading;

        for (let i = -90; i <= 90; i += 30) {
            const degree = (centerDegree + i + 360) % 360;
            const cardinal = degreesToCardinal(degree);

            // Only show cardinal at major points (N, NE, E, SE, S, SW, W, NW)
            const showCardinal = degree % 45 === 0;

            ticks.push(
                <View key={i} style={styles.tick}>
                    {showCardinal && (
                        <Text style={styles.cardinalText}>{cardinal}</Text>
                    )}
                    <Text style={styles.degreeText}>{degree}°</Text>
                </View>
            );
        }

        return ticks;
    };

    return (
        <View style={styles.container}>
            {/* Compass Ruler */}
            <View style={styles.ruler}>
                {renderRuler()}
            </View>

            {/* Center Indicator (green line) */}
            <View style={styles.centerIndicator} />

            {/* Info Bar */}
            <View style={styles.infoBar}>
                <Text style={styles.infoText}>
                    🧭 {Math.round(normalizedHeading)}°{degreesToCardinal(normalizedHeading)} (T)
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    ruler: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        height: 60,
    },
    tick: {
        alignItems: 'center',
        flex: 1,
    },
    cardinalText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    degreeText: {
        color: '#999',
        fontSize: 12,
    },
    centerIndicator: {
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 3,
        height: 60,
        backgroundColor: '#4ade80',
        marginLeft: -1.5,
    },
    infoBar: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.2)',
    },
    infoText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'monospace',
    },
});
