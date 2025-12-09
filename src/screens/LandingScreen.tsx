import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { FloatingIcon } from '../components/FloatingIcon';
import { TypewriterText } from '../components/TypewriterText';
import { RootStackParamList } from '../types';

const { height } = Dimensions.get('window');

// #region Type
type LandingScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Landing'>;
};
// #endregion Type

// #region Landing Screen Comp
export const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
    const [learnMoreOpen, setLearnMoreOpen] = useState(false);

    // Animation values
    const logoOpacity = useSharedValue(0);
    const logoScale = useSharedValue(0.5);
    const buttonsTranslateY = useSharedValue(10);
    const learnMoreHeight = useSharedValue(0);
    const learnMoreOpacity = useSharedValue(0);

    // #region Initialize animations
    useEffect(() => {
        // Logo fade-in + scale bounce (500ms delay)
        logoOpacity.value = withDelay(50, withTiming(1, { duration: 80 }));
        logoScale.value = withDelay(
            500,
            withSequence(
                withSpring(1.1, { damping: 8 }),
                withSpring(1, { damping: 10 })
            )
        );

        // Buttons slide up (1500ms delay)
        buttonsTranslateY.value = withDelay(
            150,
            withSpring(0, {
                damping: 15,
                stiffness: 100,
            })
        );
    }, []);
    // #endregion Initialize animations

    // #region Learn More Toggle

    const toggleLearnMore = () => {
        setLearnMoreOpen(!learnMoreOpen);

        if (!learnMoreOpen) {
            // Open animation
            learnMoreHeight.value = withSpring(280, { damping: 20 });
            learnMoreOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
        } else {
            // Close animation
            learnMoreOpacity.value = withTiming(0, { duration: 200 });
            learnMoreHeight.value = withDelay(200, withSpring(0, { damping: 20 }));
        }
    };

    // Animated styles
    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }));

    const buttonsAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: buttonsTranslateY.value }],
        opacity: buttonsTranslateY.value === 0 ? 1 : 0,
    }));

    const learnMoreAnimatedStyle = useAnimatedStyle(() => ({
        height: learnMoreHeight.value,
        opacity: learnMoreOpacity.value,
    }));
    // #endregion Learn More Toggle

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Floating Background Icons */}
                <FloatingIcon icon="🐾" delay={0} duration={4000} />
                <FloatingIcon icon="🏠" delay={1000} duration={5000} />
                <FloatingIcon icon="🐾" delay={2000} duration={4500} />
                <FloatingIcon icon="🏡" delay={1500} duration={5500} />
                <FloatingIcon icon="🐕" delay={500} duration={6000} />
                <FloatingIcon icon="🐈" delay={2500} duration={5000} />

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo Section with Animation */}
                    <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
                        <Image style={styles.logoEmoji} source={require('../../assets/images/icon.png')} />
                        <Text style={styles.logoText}>SitConnect</Text>
                        <Text style={styles.tagline}>Where Care Meets Connection</Text>
                    </Animated.View>

                    {/* Animated Text Section */}
                    <View style={styles.textSection}>
                        <TypewriterText
                            text="Find trusted pet or house sitters"
                            delay={1800}
                            style={styles.featureText}
                        />
                        <TypewriterText
                            text="Or become a sitter and earn doing what you love"
                            delay={2500}
                            style={styles.featureText}
                        />
                    </View>

                    {/* Buttons Section with Slide-Up Animation */}
                    <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => navigation.navigate('SignUp')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.primaryButtonText}>Get Started</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.secondaryButtonText}>Sign In</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.learnMoreButton]}
                            onPress={toggleLearnMore}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.learnMoreButtonText}>
                                {learnMoreOpen ? '▲ Show Less' : '▼ Learn More'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Collapsible Learn More Section */}
                    <Animated.View style={[styles.learnMoreContainer, learnMoreAnimatedStyle]}>
                        <View style={styles.learnMoreContent}>
                            <Text style={styles.learnMoreTitle}>Why SitConnect?</Text>

                            <View style={styles.bulletPoint}>
                                <Text style={styles.bulletIcon}>✓</Text>
                                <Text style={styles.bulletText}>
                                    Connect with verified pet and house sitters in your area
                                </Text>
                            </View>

                            <View style={styles.bulletPoint}>
                                <Text style={styles.bulletIcon}>✓</Text>
                                <Text style={styles.bulletText}>
                                    Browse listings, filter by your needs, and save favorites
                                </Text>
                            </View>

                            <View style={styles.bulletPoint}>
                                <Text style={styles.bulletIcon}>✓</Text>
                                <Text style={styles.bulletText}>
                                    Earn money by offering sitting services when you're free
                                </Text>
                            </View>

                            <View style={styles.bulletPoint}>
                                <Text style={styles.bulletIcon}>✓</Text>
                                <Text style={styles.bulletText}>
                                    Safe, simple, and built for the community
                                </Text>
                            </View>

                            <View style={styles.bulletPoint}>
                                <Text style={styles.bulletIcon}>✓</Text>
                                <Text style={styles.bulletText}>
                                    No subscriptions, no hidden fees - just honest connections
                                </Text>
                            </View>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
    // #endregion Render
};
// #endregion Landing Screen Comp

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoEmoji: {
        width: 200,
        height: 200,
        marginBottom: 16,
    },
    logoText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#2c3e50',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 16,
        color: '#7f8c8d',
        marginTop: 8,
        fontStyle: 'italic',
    },
    textSection: {
        marginBottom: 50,
        paddingHorizontal: 8,
    },
    featureText: {
        fontSize: 18,
        color: '#34495e',
        marginBottom: 16,
        lineHeight: 28,
        textAlign: 'center',
    },
    buttonsContainer: {
        gap: 16,
        marginBottom: 20,
    },
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButton: {
        backgroundColor: '#3498db',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        backgroundColor: '#2ecc71',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    learnMoreButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#95a5a6',
        shadowOpacity: 0,
        elevation: 0,
    },
    learnMoreButtonText: {
        color: '#7f8c8d',
        fontSize: 16,
        fontWeight: '600',
    },
    learnMoreContainer: {
        overflow: 'hidden',
        marginTop: 10,
    },
    learnMoreContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    learnMoreTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 16,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    bulletIcon: {
        fontSize: 18,
        color: '#2ecc71',
        marginRight: 12,
        marginTop: 2,
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        color: '#34495e',
        lineHeight: 22,
    },
});
// #endregion Styles