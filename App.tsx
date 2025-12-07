import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { initDatabase } from './src/database/db';

export default function App() {
    const [dbReady, setDbReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initialize database when app starts
        const setup = async () => {
            try {
                await initDatabase();
                setDbReady(true);
            } catch (err) {
                console.error('Setup error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        };

        setup();
    }, []); // Empty array means "run once on mount"

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>❌ Error: {error}</Text>
            </View>
        );
    }

    if (!dbReady) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={styles.text}>Initializing database...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text style={styles.success}>✅ Database Ready!</Text>
            <Text style={styles.text}>Check the console for logs</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
    },
    error: {
        fontSize: 18,
        color: '#f44336',
    },
    text: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
});