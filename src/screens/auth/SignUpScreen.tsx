import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { signUp } from '../../services/authService';
import { RootStackParamList, UserRole } from '../../types';

// #region Types
type SignUpScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};
// #endregion Types

// #region Sign Up Comp
export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
    const { login } = useAuth(); // Use login from context

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.REQUESTER);
    const [loading, setLoading] = useState(false);

    // Animation values
    const formOpacity = useSharedValue(0);
    const formTranslateY = useSharedValue(50);

    useEffect(() => {
        formOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
        formTranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));
    }, []);

    // #region Form Validation
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
    // #endregion Form Validation

    // #region Handle Sign Up
    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Create user account
            const user = await signUp(firstName, lastName, email, password, role);

            // Login via context (saves to AsyncStorage)
            await login(user);

            Alert.alert(
                'Success',
                `Welcome to SitConnect, ${user.name}!`,
                [
                    {
                        text: 'Get Started',
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
                ]
            );
        } catch (error: any) {
            console.error('Signup error:', error);
            Alert.alert('Error', error.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };
    // #endregion Handle Sign Up

    const formAnimatedStyle = useAnimatedStyle(() => ({
        opacity: formOpacity.value,
        transform: [{ translateY: formTranslateY.value }],
    }));

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join SitConnect today</Text>
                    </View>

                    {/* Form */}
                    <Animated.View style={[styles.form, formAnimatedStyle]}>
                        {/* Name Inputs */}
                        <View style={styles.nameRow}>
                            <View style={styles.nameInput}>
                                <Text style={styles.label}>First Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="John"
                                    value={firstName}
                                    onChangeText={setFirstName}
                                    autoCapitalize="words"
                                />
                            </View>
                            <View style={styles.nameInput}>
                                <Text style={styles.label}>Last Name *</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Doe"
                                    value={lastName}
                                    onChangeText={setLastName}
                                    autoCapitalize="words"
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="your.email@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="At least 6 characters"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Role Selection */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>I want to *</Text>
                            <Text style={styles.roleDescription}>
                                Choose your primary use of the app
                            </Text>
                            <View style={styles.roleButtons}>
                                {/* Requester Button */}
                                <TouchableOpacity
                                    style={[
                                        styles.roleButton,
                                        role === UserRole.REQUESTER && styles.roleButtonActive,
                                    ]}
                                    onPress={() => setRole(UserRole.REQUESTER)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.roleContent}>
                                        <Text style={styles.roleEmoji}>🔍</Text>
                                        <Text
                                            style={[
                                                styles.roleTitle,
                                                role === UserRole.REQUESTER && styles.roleTitleActive,
                                            ]}
                                        >
                                            Find a Sitter
                                        </Text>
                                        <Text
                                            style={[
                                                styles.roleSubtitle,
                                                role === UserRole.REQUESTER && styles.roleSubtitleActive,
                                            ]}
                                        >
                                            Post sitting needs
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Sitter Button */}
                                <TouchableOpacity
                                    style={[
                                        styles.roleButton,
                                        role === UserRole.SITTER && styles.roleButtonActive,
                                    ]}
                                    onPress={() => setRole(UserRole.SITTER)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.roleContent}>
                                        <Text style={styles.roleEmoji}>💼</Text>
                                        <Text
                                            style={[
                                                styles.roleTitle,
                                                role === UserRole.SITTER && styles.roleTitleActive,
                                            ]}
                                        >
                                            Be a Sitter
                                        </Text>
                                        <Text
                                            style={[
                                                styles.roleSubtitle,
                                                role === UserRole.SITTER && styles.roleSubtitleActive,
                                            ]}
                                        >
                                            Browse opportunities
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.signupButtonText}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
    // #endregion Render
};

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
        paddingBottom: 40,
    },
    header: {
        marginTop: 20,
        marginBottom: 30,
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 16,
        color: '#3498db',
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    form: {
        gap: 20,
    },
    nameRow: {
        flexDirection: 'row',
        gap: 12,
    },
    nameInput: {
        flex: 1,
        gap: 8,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#2c3e50',
    },
    roleDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        marginBottom: 8,
    },
    roleButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    roleButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    roleButtonActive: {
        backgroundColor: '#3498db',
        borderColor: '#3498db',
        shadowOpacity: 0.15,
        elevation: 4,
    },
    roleContent: {
        alignItems: 'center',
        gap: 8,
    },
    roleEmoji: {
        fontSize: 40,
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    roleTitleActive: {
        color: '#fff',
    },
    roleSubtitle: {
        fontSize: 13,
        color: '#7f8c8d',
        textAlign: 'center',
    },
    roleSubtitleActive: {
        color: '#fff',
        opacity: 0.9,
    },
    signupButton: {
        backgroundColor: '#27ae60',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    signupButtonDisabled: {
        backgroundColor: '#95a5a6',
    },
    signupButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    loginText: {
        fontSize: 15,
        color: '#7f8c8d',
    },
    loginLink: {
        fontSize: 15,
        color: '#3498db',
        fontWeight: 'bold',
    },
    // #endregion Styles
});