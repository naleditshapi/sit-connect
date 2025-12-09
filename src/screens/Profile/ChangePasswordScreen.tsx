import { useNavigation } from '@react-navigation/native';
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

// #region Change Password Comp
export const ChangePasswordScreen: React.FC = () => {
    const navigation = useNavigation();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // #region Form Validation
    const validateForm = (): boolean => {
        if (!currentPassword) {
            Alert.alert('Error', 'Please enter your current password');
            return false;
        }
        if (!newPassword || newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return false;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        return true;
    };
    // #endregion Form Validation

    // #region Handle Change Password
    const handleChangePassword = async () => {
        if (!validateForm()) return;

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            Alert.alert('Success', 'Password changed successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }, 1000);
    };
    // #endregion Handle Change Password

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.title}>Change Password</Text>
                    <Text style={styles.subtitle}>
                        Choose a strong password and don't reuse it for other accounts
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password *</Text>
                        <TextInput
                            style={styles.input}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            placeholder="Enter current password"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password *</Text>
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            placeholder="At least 6 characters"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password *</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Re-enter new password"
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        <Text style={styles.saveButtonText}>
                            {loading ? 'Changing...' : 'Change Password'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.forgotButton}
                        onPress={() => Alert.alert('Forgot Password', 'Password reset link sent to your email')}
                    >
                        <Text style={styles.forgotButtonText}>Forgot your current password?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
    // #endregion Render
};
// #endregion Change Password Comp

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#2c3e50',
    },
    saveButton: {
        backgroundColor: '#3498db',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonDisabled: {
        backgroundColor: '#95a5a6',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotButton: {
        marginTop: 16,
        alignItems: 'center',
    },
    forgotButtonText: {
        color: '#3498db',
        fontSize: 14,
        fontWeight: '600',
    },
});