import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from 'react-native-reanimated';

interface TypewriterTextProps {
    text: string;
    delay?: number;
    speed?: number;
    style?: TextStyle;
}

/**
 * Typewriter Text Component
 * 
 * Creates a typing animation effect
 * Text appears character by character with fade-in
 */
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

        // Typing effect
        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, speed);

        // Cleanup
        return () => clearInterval(typingInterval);
    }, [text, delay, speed]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.Text style={[style, animatedStyle]}>
            {displayedText}
            {displayedText.length < text.length && (
                <Text style={{ opacity: 0.5 }}>|</Text>
            )}
        </Animated.Text>
    );
};

