import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { initDatabase } from './src/database/db';
import { AppNavigator } from './src/navigation/AppNavigator';

// #region App Component
export default function App() {
    const [dbReady, setDbReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (Platform.OS === 'web') {
            setError('web_not_supported');
            return;
        }

        // Initialize database
        const setup = async () => {
            try {
                console.log('Starting app initialization...');
                await initDatabase();
                console.log('App initialization complete');
                setDbReady(true);
            } catch (err) {
                console.error('Setup error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        setup();
    }, []);

    // #region Web Platform Msg
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
    // #endregion Web Platform Msg

    // #region Other errors
    if (error) {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
                    <Text style={styles.errorMessage}>{error}</Text>

                    <View style={styles.errorDetailsBox}>
                        <Text style={styles.errorDetailsTitle}>What happened?</Text>
                        <Text style={styles.errorDetailsText}>
                            The app encountered an error while initializing the database.
                            This usually happens due to storage permissions or corrupted data.
                        </Text>
                    </View>

                    <View style={styles.errorDetailsBox}>
                        <Text style={styles.errorDetailsTitle}>How to fix it:</Text>
                        <Text style={styles.errorDetailsText}>
                            1. Close and restart the app{'\n'}
                            2. If problem persists, delete the app and reinstall{'\n'}
                            3. Make sure you have enough storage space{'\n'}
                            4. Contact support if issue continues
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                            setError(null);
                            setDbReady(false);
                        }}
                    >
                        <Text style={styles.retryButtonText}>🔄 Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    // #endregion Other errors

    // #region Loading state
    if (!dbReady) {
        return (
            <View style={styles.container}>
                <StatusBar style="auto" />
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.loadingText}>Initializing SitConnect...</Text>
                <Text style={styles.hint}>Setting up database</Text>
            </View>
        );
    }
    // #endregion Loading state

    // #region Show Actual App
    console.log('RENDERING APPNAVIGATOR NOW');
    return (
        <>
            <StatusBar style="auto" />
            <AppNavigator />
        </>
    );
    // #endregion Show Actual App
}

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f44336',
        marginBottom: 10,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: 16,
        color: '#d32f2f',
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: '600',
    },
    errorDetailsBox: {
        backgroundColor: '#ffebee',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#f44336',
    },
    errorDetailsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#c62828',
        marginBottom: 8,
    },
    errorDetailsText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    retryButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    // #endregion Styles

});
// #endregion App Component
