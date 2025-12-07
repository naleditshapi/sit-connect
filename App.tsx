import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import { initDatabase } from './src/database/db';

export default function App() {
    const [dbReady, setDbReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if we're running on a platform that supports SQLite
        if (Platform.OS === 'web') {
            // Web doesn't support SQLite - show message instead
            setError('web_not_supported');
            return;
        }

        // Initialize database for iOS/Android
        const setup = async () => {
            try {
                console.log('🚀 Starting database initialization...');
                await initDatabase();
                console.log('✅ Database initialization complete');
                setDbReady(true);
            } catch (err) {
                console.error('❌ Setup error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        setup();
    }, []); // Empty dependency array = run once when component mounts

    // Special handling for web platform
    if (error === 'web_not_supported') {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Text style={styles.webEmoji}>🌐</Text>
                <Text style={styles.webTitle}>Web Version Not Supported</Text>
                <Text style={styles.webText}>
                    This app uses SQLite which only works on iOS and Android.
                </Text>
                <Text style={styles.webText}>
                    Please use Expo Go on your mobile device:
                </Text>
                <View style={styles.instructionsBox}>
                    <Text style={styles.instruction}>1. Install Expo Go from App Store</Text>
                    <Text style={styles.instruction}>2. Run: npx expo start</Text>
                    <Text style={styles.instruction}>3. Scan the QR code</Text>
                </View>
            </View>
        );
    }

    // Handle other errors
    if (error) {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Text style={styles.error}>❌ Error</Text>
                <Text style={styles.errorText}>{error}</Text>
                <Text style={styles.hint}>Try restarting the app</Text>
            </View>
        );
    }

    // Show loading spinner while database initializes
    if (!dbReady) {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Initializing database...</Text>
                <Text style={styles.hint}>This should only take a moment</Text>
            </View>
        );
    }

    // Success! Database is ready
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.success}>✅ Database Ready!</Text>
            <Text style={styles.text}>Check the console for initialization logs</Text>
            <Text style={styles.hint}>Platform: {Platform.OS}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    success: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
    },
    error: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f44336',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 15,
    },
    hint: {
        fontSize: 14,
        color: '#999',
        marginTop: 10,
        fontStyle: 'italic',
    },
    webEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    webTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    webText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    instructionsBox: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        borderRadius: 10,
        marginTop: 20,
    },
    instruction: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
});