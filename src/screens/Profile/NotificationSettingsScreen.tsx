import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// #region Notification Settings Comp
export const NotificationSettingsScreen: React.FC = () => {
    const navigation = useNavigation();

    // Notification preferences
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [smsEnabled, setSmsEnabled] = useState(false);

    // Types
    const [newRequests, setNewRequests] = useState(true);
    const [messages, setMessages] = useState(true);
    const [bookingUpdates, setBookingUpdates] = useState(true);
    const [marketing, setMarketing] = useState(false);

    // #region Handle Save
    const handleSave = () => {

        Alert.alert('Success', 'Notification preferences updated!');
    };
    // #endregion Handle Save

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Notifications</Text>
                    <Text style={styles.subtitle}>
                        Choose how you want to receive notifications
                    </Text>
                </View>

                {/* Channels */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>CHANNELS</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Push Notifications</Text>
                            <Text style={styles.settingDescription}>
                                Receive notifications on this device
                            </Text>
                        </View>
                        <Switch
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
                            trackColor={{ false: '#e0e0e0', true: '#3498db' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Email</Text>
                            <Text style={styles.settingDescription}>
                                Receive notifications via email
                            </Text>
                        </View>
                        <Switch
                            value={emailEnabled}
                            onValueChange={setEmailEnabled}
                            trackColor={{ false: '#e0e0e0', true: '#3498db' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>SMS</Text>
                            <Text style={styles.settingDescription}>
                                Receive text messages
                            </Text>
                        </View>
                        <Switch
                            value={smsEnabled}
                            onValueChange={setSmsEnabled}
                            trackColor={{ false: '#e0e0e0', true: '#3498db' }}
                        />
                    </View>
                </View>

                {/* Types */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>NOTIFICATION TYPES</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>New Requests</Text>
                            <Text style={styles.settingDescription}>
                                When someone requests your services
                            </Text>
                        </View>
                        <Switch
                            value={newRequests}
                            onValueChange={setNewRequests}
                            trackColor={{ false: '#e0e0e0', true: '#3498db' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Messages</Text>
                            <Text style={styles.settingDescription}>
                                New messages from users
                            </Text>
                        </View>
                        <Switch
                            value={messages}
                            onValueChange={setMessages}
                            trackColor={{ false: '#e0e0e0', true: '#3498db' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Booking Updates</Text>
                            <Text style={styles.settingDescription}>
                                Status changes and reminders
                            </Text>
                        </View>
                        <Switch
                            value={bookingUpdates}
                            onValueChange={setBookingUpdates}
                            trackColor={{ false: '#e0e0e0', true: '#3498db' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Marketing</Text>
                            <Text style={styles.settingDescription}>
                                News, tips, and special offers
                            </Text>
                        </View>
                        <Switch
                            value={marketing}
                            onValueChange={setMarketing}
                            trackColor={{ false: '#e0e0e0', true: '#3498db' }}
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Preferences</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
    // #endregion Render
};
// #endregion Notification Settings Comp

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
    },
    section: {
        marginTop: 24,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#95a5a6',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingInfo: {
        flex: 1,
        marginRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2c3e50',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#95a5a6',
    },
    saveButton: {
        backgroundColor: '#3498db',
        marginHorizontal: 20,
        marginTop: 24,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
// #endregion Styles