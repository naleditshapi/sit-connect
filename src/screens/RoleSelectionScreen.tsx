import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../types';

/**
 * Props that this screen receives
 * React Navigation automatically passes 'navigation' prop
 */
type RoleSelectionScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'RoleSelection'>;
};

/**
 * Role Selection Screen
 * First screen users see - choose your role in the app
 */
export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ navigation }) => {
    /**
     * Handle "I need a sitter" button press
     * Navigate to requester home screen (My Listings)
     */
    const handleRequesterPress = () => {
        console.log('🔍 User chose: I need a sitter');
        navigation.navigate('RequesterHome');
    };

    /**
     * Handle "I am a sitter" button press
     * Navigate to sitter home screen (Browse Listings)
     */
    const handleSitterPress = () => {
        console.log('💼 User chose: I am a sitter');
        navigation.navigate('SitterHome');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Logo/Icon */}
                <Text style={styles.logo}>🏠🐾</Text>

                {/* App Title */}
                <Text style={styles.title}>SitConnect</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    Connect with trusted sitters in your area
                </Text>

                {/* Role Selection Buttons */}
                <View style={styles.buttonContainer}>
                    {/* Requester Button */}
                    <TouchableOpacity
                        style={[styles.roleButton, styles.requesterButton]}
                        onPress={handleRequesterPress}
                        activeOpacity={0.8} // Slight transparency when pressed
                    >
                        <Text style={styles.roleEmoji}>🔍</Text>
                        <Text style={styles.roleTitle}>I need a sitter</Text>
                        <Text style={styles.roleDescription}>
                            Post your pet or house sitting needs
                        </Text>
                    </TouchableOpacity>

                    {/* Sitter Button */}
                    <TouchableOpacity
                        style={[styles.roleButton, styles.sitterButton]}
                        onPress={handleSitterPress}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.roleEmoji}>💼</Text>
                        <Text style={styles.roleTitle}>I am a sitter</Text>
                        <Text style={styles.roleDescription}>
                            Browse and save sitting opportunities
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

/**
 * Styles for the screen
 * 
 * StyleSheet.create benefits:
 * - Validates style properties at build time
 * - Optimizes style objects
 * - Better performance than inline styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1, // Take up full screen
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center', // Center vertically
        alignItems: 'center',     // Center horizontally
        padding: 20,
    },
    logo: {
        fontSize: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 48,
    },
    buttonContainer: {
        width: '100%',
        gap: 16, // Space between buttons (modern React Native feature)
    },
    roleButton: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Elevation for Android
        elevation: 3,
    },
    requesterButton: {
        backgroundColor: '#4CAF50', // Green
    },
    sitterButton: {
        backgroundColor: '#2196F3', // Blue
    },
    roleEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    roleTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    roleDescription: {
        fontSize: 14,
        color: '#fff',
        opacity: 0.9,
        textAlign: 'center',
    },
});