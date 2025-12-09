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

// #region Types
interface FloatingIconProps {
    icon: string;
    delay?: number;
    duration?: number;
}
// #endregion Types

// #region Floating Icon Comp
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

    // #region Animation Effect
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
    // #endregion Animation Effect

    // #region Animated Style   
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
    // #endregion Animated Style
};
// #endregion Floating Icon Comp

// #region Styles
const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        fontSize: 40,
        zIndex: -1,
    },
    // #endregion Styles
});
