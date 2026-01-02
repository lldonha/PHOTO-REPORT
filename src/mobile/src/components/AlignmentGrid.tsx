// Alignment Grid - Dashed grid lines for photo alignment (visible only during capture)
// Based on SoloCator alignment feature

import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
    visible: boolean;
}

export default function AlignmentGrid({ visible }: Props) {
    if (!visible) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Vertical Lines */}
            <View style={[styles.line, styles.verticalLeft]} />
            <View style={[styles.line, styles.verticalCenter]} />
            <View style={[styles.line, styles.verticalRight]} />

            {/* Horizontal Lines */}
            <View style={[styles.line, styles.horizontalTop]} />
            <View style={[styles.line, styles.horizontalCenter]} />
            <View style={[styles.line, styles.horizontalBottom]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
    },
    line: {
        position: 'absolute',
        backgroundColor: 'transparent',
    },
    // Vertical lines
    verticalLeft: {
        left: '33.33%',
        top: 0,
        bottom: 0,
        width: 0,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.4)',
        borderStyle: 'dashed',
    },
    verticalCenter: {
        left: '50%',
        top: 0,
        bottom: 0,
        width: 0,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
    },
    verticalRight: {
        left: '66.66%',
        top: 0,
        bottom: 0,
        width: 0,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255, 255, 255, 0.4)',
        borderStyle: 'dashed',
    },
    // Horizontal lines
    horizontalTop: {
        top: '33.33%',
        left: 0,
        right: 0,
        height: 0,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.4)',
        borderStyle: 'dashed',
    },
    horizontalCenter: {
        top: '50%',
        left: 0,
        right: 0,
        height: 0,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
    },
    horizontalBottom: {
        top: '66.66%',
        left: 0,
        right: 0,
        height: 0,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.4)',
        borderStyle: 'dashed',
    },
});
