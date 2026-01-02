// Photo With Overlay Preview - Renders photo with overlay for ViewShot capture

import React, { forwardRef } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import PhotoOverlay from './PhotoOverlay';
import { PhotoMetadata } from '../types/photo';

interface Props {
    photoUri: string;
    metadata: PhotoMetadata;
    projectName: string;
    caption: string;
    width: number;
    height: number;
}

const PhotoWithOverlayPreview = forwardRef<View, Props>(
    ({ photoUri, metadata, projectName, caption, width, height }, ref) => {
        return (
            <View ref={ref} style={[styles.container, { width, height }]}>
                {/* Photo */}
                <Image
                    source={{ uri: photoUri }}
                    style={[styles.photo, { width, height }]}
                    resizeMode="cover"
                />

                {/* Overlay */}
                <PhotoOverlay
                    metadata={metadata}
                    projectName={projectName}
                    caption={caption}
                    width={width}
                    height={height}
                />
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -10000, // Render offscreen
        left: -10000,
    },
    photo: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
});

export default PhotoWithOverlayPreview;
