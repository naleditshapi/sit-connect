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
import { signUp } from '../../services/authService';
import { RootStackParamList, UserRole } from '../../types';

type SignUpScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
    const { setUser } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.REQUESTER);
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        if (!firstName.trim() || !lastName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return false;
        }
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return false;
        }
        if (!email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const user = await signUp(firstName, lastName, email, password, role);
            setUser(user);

            Alert.alert('Success', 'Account created successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate based on role
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
                    },
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join SitConnect today</Text>

                {/* First Name */}
                <Text style={styles.label}>First Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="John"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                />

                {/* Last Name */}
                <Text style={styles.label}>Last Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                />

                {/* Email */}
                <Text style={styles.label}>Email *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="john.doe@example.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                {/* Password */}
                <Text style={styles.label}>Password *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="At least 6 characters"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                {/* Role Selection */}
                <Text style={styles.label}>I want to *</Text>
                <View style={styles.roleButtons}>
                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            role === UserRole.REQUESTER && styles.roleButtonActive,
                        ]}
                        onPress={() => setRole(UserRole.REQUESTER)}
                    >
                        <Text style={styles.roleEmoji}>🔍</Text>
                        <Text
                            style={[
                                styles.roleButtonText,
                                role === UserRole.REQUESTER && styles.roleButtonTextActive,
                            ]}
                        >
                            Find a Sitter
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.roleButton,
                            role === UserRole.SITTER && styles.roleButtonActive,
                        ]}
                        onPress={() => setRole(UserRole.SITTER)}
                    >
                        <Text style={styles.roleEmoji}>💼</Text>
                        <Text
                            style={[
                                styles.roleButtonText,
                                role === UserRole.SITTER && styles.roleButtonTextActive,
                            ]}
                        >
                            Be a Sitter
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSignUp}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                {/* Login Link */}
                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginLinkText}>
                        Already have an account? <Text style={styles.loginLinkBold}>Log In</Text>
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
    roleButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    roleButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ddd',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    roleButtonActive: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    roleEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    roleButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    roleButtonTextActive: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
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
    loginLink: {
        marginTop: 24,
        marginBottom: 40,
        alignItems: 'center',
    },
    loginLinkText: {
        fontSize: 16,
        color: '#666',
    },
    loginLinkBold: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
});