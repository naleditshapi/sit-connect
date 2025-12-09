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
import { login } from '../../services/authService';
import { RootStackParamList, UserRole } from '../../types';

// #region Types
type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};
// #endregion Types

// #region Login Component
export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const { setUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    // Animation values
    const formOpacity = useSharedValue(0);
    const formTranslateY = useSharedValue(50);

    useEffect(() => {
        // Entrance animation
        formOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
        formTranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));
    }, []);

    // #region Handle Login
    const handleLogin = async () => {
        // Basic validation
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        // #region Authenticate User
        setLoading(true);
        try {
            // Authenticate user
            const user = await login(email, password);
            setUser(user);

            console.log('✅ User logged in:', user.email, 'Role:', user.role);

            // Navigate based on user role stored in database
            if (user.role === UserRole.REQUESTER) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'RequesterTabs' }],
                });
            } else if (user.role === UserRole.SITTER) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SitterTabs' }],
                });
            }
        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
        // #endregion Authenticate User
    };
    // #endregion Handle Login

    // #region Animated styles
    const formAnimatedStyle = useAnimatedStyle(() => ({
        opacity: formOpacity.value,
        transform: [{ translateY: formTranslateY.value }],
    }));
    // #endregion Animated styles

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
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
                    </View>

                    {/* Form */}
                    <Animated.View style={[styles.form, formAnimatedStyle]}>
                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
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

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Remember Me & Forgot Password */}
                        <View style={styles.optionsRow}>
                            <TouchableOpacity
                                style={styles.rememberMeContainer}
                                onPress={() => setRememberMe(!rememberMe)}
                            >
                                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.rememberMeText}>Remember me</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Password reset feature coming soon!')}>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Test Credentials Info */}
                        <View style={styles.testInfo}>
                            <Text style={styles.testInfoTitle}>🧪 Test Accounts:</Text>
                            <Text style={styles.testInfoText}>Requester: requester@test.com</Text>
                            <Text style={styles.testInfoText}>Sitter: sitter@test.com</Text>
                            <Text style={styles.testInfoText}>Password: password123</Text>
                        </View>

                        {/* Login Button */}
                        <TouchableOpacity
                            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginButtonText}>
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Login Buttons (Optional) */}
                        <TouchableOpacity
                            style={styles.socialButton}
                            onPress={() => Alert.alert('Coming Soon', 'Google sign-in coming soon!')}
                        >
                            <Text style={styles.socialButtonText}>🔍 Continue with Google</Text>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
    // #endregion Render
};
// #endregion Login Component

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
        marginBottom: 40,
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
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#3498db',
        borderColor: '#3498db',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rememberMeText: {
        fontSize: 14,
        color: '#7f8c8d',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#3498db',
        fontWeight: '600',
    },
    testInfo: {
        backgroundColor: '#FFF3CD',
        padding: 16,
        borderRadius: 12,
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
    loginButton: {
        backgroundColor: '#3498db',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonDisabled: {
        backgroundColor: '#95a5a6',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        color: '#7f8c8d',
    },
    socialButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    socialButtonText: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '600',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    signupText: {
        fontSize: 15,
        color: '#7f8c8d',
    },
    signupLink: {
        fontSize: 15,
        color: '#3498db',
        fontWeight: 'bold',
    },
});
// #endregion Styles