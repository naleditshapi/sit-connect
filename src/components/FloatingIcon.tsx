import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface FloatingIconProps {
    icon: string;
    delay?: number;
    duration?: number;
}

/**
 * Floating Icon Component
 * 
 * Creates a floating, drifting icon in the background
 * Uses low opacity to not distract from main content
 * Animates position in a smooth loop
 */
export const FloatingIcon: React.FC<FloatingIconProps> = ({
    icon,
    delay = 0,
    duration = 5000,
}) => {
    // Random starting position
    const startX = Math.random() * (width - 60);
    const startY = Math.random() * (height - 100);

    // Animation values
    const translateX = useSharedValue(startX);
    const translateY = useSharedValue(startY);
    const opacity = useSharedValue(0);

    useEffect(() => {
        // Fade in
        opacity.value = withDelay(
            delay,
            withTiming(0.15, { duration: 1000 })
        );

        // Random drift pattern
        const targetX = Math.random() * (width - 60);
        const targetY = Math.random() * (height - 100);

        // Smooth drifting animation (infinite loop)
        translateX.value = withDelay(
            delay,
            withRepeat(
                withTiming(targetX, {
                    duration: duration,
                    easing: Easing.inOut(Easing.ease),
                }),
                -1, // Infinite
                true // Reverse (go back and forth)
            )
        );

        translateY.value = withDelay(
            delay,
            withRepeat(
                withTiming(targetY, {
                    duration: duration * 1.2, // Slightly different duration for more natural movement
                    easing: Easing.inOut(Easing.ease),
                }),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    return (
        <Animated.Text style={[styles.icon, animatedStyle]}>
            {icon}
        </Animated.Text>
    );
};

const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        fontSize: 40,
        zIndex: -1, // Behind other content
    },
});
