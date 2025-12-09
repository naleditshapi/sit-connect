import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

// #region Types
interface TypewriterTextProps {
    text: string;
    delay?: number;
    speed?: number;
    style?: TextStyle;
}
// #endregion Types

// #region Typewriter Text Comp
export const TypewriterText: React.FC<TypewriterTextProps> = ({
    text,
    delay = 0,
    speed = 50,
    style,
}) => {
    const [displayedText, setDisplayedText] = useState('');
    const opacity = useSharedValue(0);

    useEffect(() => {
        // Fade in the text container
        opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));

        // #region Typing effect
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);
        // #endregion Typing effect

        // #region Cleanup
        return () => clearInterval(typingInterval);
        // #endregion Cleanup
    }, [text, delay, speed]);

    // #region Animated Style
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));
    // #endregion Animated Style

    // #region Render
    return (
        <Animated.Text style={[style, animatedStyle]}>
            {displayedText}
            {displayedText.length < text.length && (
                <Text style={{ opacity: 0.5 }}>|</Text>
            )}
        </Animated.Text>
    );
    // #endregion Render
};
// #endregion Typewriter Text Comp
