// Photo Overlay - Complete SoloCator-style overlay for photos
// Includes compass, GPS info, and caption
// Supports 3 capture modes: Compass, Building, Street

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PhotoMetadata, CaptureMode } from '../types/photo';
import CompassOverlay from './CompassOverlay';

interface Props {
    metadata: PhotoMetadata;
    projectName: string;
    caption: string;
    width: number;
    height: number;
    captureMode?: CaptureMode;
}

// Convert degrees to cardinal direction
const degreesToCardinal = (degrees: number): string => {
    const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return cardinals[index];
};

// Get building elevation suffix based on direction (for Building mode)
const getBuildingElevation = (degrees: number): string => {
    const cardinal = degreesToCardinal(degrees);
    // Convert short cardinal to full word
    const fullCardinal: { [key: string]: string } = {
        'N': 'North', 'NNE': 'North-Northeast', 'NE': 'Northeast', 'ENE': 'East-Northeast',
        'E': 'East', 'ESE': 'East-Southeast', 'SE': 'Southeast', 'SSE': 'South-Southeast',
        'S': 'South', 'SSW': 'South-Southwest', 'SW': 'Southwest', 'WSW': 'West-Southwest',
        'W': 'West', 'WNW': 'West-Northwest', 'NW': 'Northwest', 'NNW': 'North-Northwest',
    };
    return `${fullCardinal[cardinal] || cardinal} Elevation`;
};

// Format date to match SoloCator style
const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const monthName = monthNames[date.getMonth()];

    return `${day} ${monthName}. ${year} ${hours}:${minutes}:${seconds}`;
};

export default function PhotoOverlay({ metadata, projectName, caption, width, height, captureMode = 'compass' }: Props) {
    const { latitude, longitude, altitude, accuracy, direction, timestamp } = metadata;

    // Building mode: Add elevation suffix to project name
    const displayProjectName = captureMode === 'building' && direction !== null
        ? `${projectName} - ${getBuildingElevation(direction)}`
        : projectName;

    return (
        <View style={[styles.container, { width, height }]}>
            {/* Compass at top (only in Compass mode) */}
            {captureMode === 'compass' && direction !== null && (
                <View style={styles.compassContainer}>
                    <CompassOverlay heading={direction} />
                </View>
            )}

            {/* GPS Info bar */}
            <View style={[
                styles.gpsBar,
                captureMode === 'compass' ? { top: 120 } : { top: 16 }
            ]}>
                <Text style={styles.gpsText}>
                    {direction !== null && `🧭 ${Math.round(direction)}°${degreesToCardinal(direction)} (T) `}
                    {latitude !== null && longitude !== null &&
                        `📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)} `}
                    {accuracy !== null && `±${Math.round(accuracy)}m `}
                    {altitude !== null && `▲ ${Math.round(altitude)}m`}
                </Text>
            </View>

            {/* Caption at bottom right */}
            <View style={styles.captionContainer}>
                {displayProjectName && (
                    <Text style={styles.projectText}>{displayProjectName}</Text>
                )}
                {caption && (
                    <Text style={styles.captionText}>{caption}</Text>
                )}
                <Text style={styles.dateText}>{formatDate(timestamp)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        justifyContent: 'space-between',
    },
    compassContainer: {
        width: '100%',
    },
    gpsBar: {
        position: 'absolute',
        top: 120, // Below compass
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    gpsText: {
        color: 'white',
        fontSize: 13,
        fontFamily: 'monospace',
    },
    captionContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        maxWidth: '70%',
    },
    projectText: {
        color: '#fbbf24',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    captionText: {
        color: '#fbbf24',
        fontSize: 14,
        marginBottom: 4,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    dateText: {
        color: 'white',
        fontSize: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});
