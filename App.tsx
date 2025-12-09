import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { initDatabase } from './src/database/db';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
    const [dbReady, setDbReady] = useState(false);

    useEffect(() => {
        getDatabase().then(() => {
            console.log("✅ Database ready");
        });
    }, []);


    useEffect(() => {
        async function setup() {
            try {
                await initDatabase();
                setDbReady(true);
                console.log('✅ Database initialized');
            } catch (error) {
                console.error('❌ Failed to initialize database:', error);
            }
        }
        setup();
    }, []);

    if (!dbReady) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    return (
        <AuthProvider>
            <AppNavigator />
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
});

async function getDatabase(): Promise<void> {
    return initDatabase();
}
