import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// #region Requester Profile Comp
export const RequesterProfileScreen: React.FC = () => {
    const navigation = useNavigation();

    // #region Mock user data
    const user = {
        name: 'Naledi',
        email: 'user@example.com',
        phone: '+27 123 456 789',
        memberSince: 'January 2025',
        listingsCount: 5,
        activeListings: 3,
    };

    // #region Handle Logout 
    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Clear auth state
                        navigation.navigate('Landing' as never);
                    },
                },
            ]
        );
    };
    // #endregion Handle Logout

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>{user.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.role}>Requester</Text>
                    <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user.listingsCount}</Text>
                        <Text style={styles.statLabel}>Total Listings</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user.activeListings}</Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('EditProfile' as never)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="person-outline" size={24} color="#333" style={{ marginRight: 20 }} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Edit Profile</Text>
                            <Text style={styles.menuSubtext}>{user.email}</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('ChangePassword' as never)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="shield-checkmark-outline" size={24} color="#333" style={{ marginRight: 20 }} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Privacy & Security</Text>
                            <Text style={styles.menuSubtext}>Password, authentication</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('NotificationSettings' as never)}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="notifications-outline" size={24} color="#333" style={{ marginRight: 20 }} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Notifications</Text>
                            <Text style={styles.menuSubtext}>Push, email, SMS</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => Alert.alert("Coming Soon", "Location settings will be available soon.")}
                    >

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="location-outline" size={24} color="#333" style={{ marginRight: 20 }} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Location</Text>
                            <Text style={styles.menuSubtext}>Cape Town, Western Cape</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => Alert.alert("Coming Soon", "Language settings will be available soon.")}
                    >

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="globe-outline" size={24} color="#333" style={{ marginRight: 20 }} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Language</Text>
                            <Text style={styles.menuSubtext}>English</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => Alert.alert("Coming Soon", "The Help Center will be available soon.")}
                    >

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="question-outline" size={24} color="#333" style={{ marginRight: 30 }} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Help Center</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => Alert.alert("Coming Soon", "Support chat will be available soon.")}
                    >

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="call-outline" size={24} color="#333" style={{ marginRight: 20 }} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Contact Support</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate("AboutApp" as never)}
                    >

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="information-circle-outline" size={24} color="#333" style={{ marginRight: 20 }} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>About SitConnect</Text>
                            <Text style={styles.menuSubtext}>Version 1.0.0</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* Bottom spacing */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
    // #endregion Render
};
// #endregion Requester Profile Comp

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    role: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        marginBottom: 8,
    },
    memberSince: {
        fontSize: 14,
        color: '#95a5a6',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginVertical: 16,
        marginHorizontal: 20,
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#95a5a6',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e0e0e0',
    },
    section: {
        marginTop: 16,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#95a5a6',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    menuContent: {
        flex: 1,
    },
    menuText: {
        fontSize: 16,
        color: '#2c3e50',
        fontWeight: '500',
        marginBottom: 2,
    },
    menuSubtext: {
        fontSize: 13,
        color: '#95a5a6',
    },
    menuArrow: {
        fontSize: 24,
        color: '#bdc3c7',
    },
    logoutButton: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 24,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e74c3c',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
    },
    // #endregion Styles
});
