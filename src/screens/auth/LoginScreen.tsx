import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService.ts';
import { RootStackParamList, UserRole } from '../../types';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const { setUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please enter your email and password');
            return;
        }

        setLoading(true);
        try {
            const user = await login(email, password);
            setUser(user);

            // Navigate based on user role
            if (user.role === UserRole.REQUESTER) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'RequesterHome' }],
                });
            } else {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SitterHome' }],
                });
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to log in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Log in to your account</Text>

                {/* Email */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="your.email@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Password */}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {/* Test Credentials Info */}
                <View style={styles.testInfo}>
                    <Text style={styles.testInfoTitle}>🧪 Test Accounts:</Text>
                    <Text style={styles.testInfoText}>Requester: requester@test.com</Text>
                    <Text style={styles.testInfoText}>Sitter: sitter@test.com</Text>
                    <Text style={styles.testInfoText}>Password: password123</Text>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <TouchableOpacity
                    style={styles.signUpLink}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={styles.signUpLinkText}>
                        Don't have an account? <Text style={styles.signUpLinkBold}>Sign Up</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 40,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    testInfo: {
        backgroundColor: '#FFF3CD',
        padding: 16,
        borderRadius: 8,
        marginTop: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC107',
    },
    testInfoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#856404',
        marginBottom: 8,
    },
    testInfoText: {
        fontSize: 13,
        color: '#856404',
        marginBottom: 4,
    },
    submitButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpLink: {
        marginTop: 24,
        marginBottom: 40,
        alignItems: 'center',
    },
    signUpLinkText: {
        fontSize: 16,
        color: '#666',
    },
    signUpLinkBold: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});