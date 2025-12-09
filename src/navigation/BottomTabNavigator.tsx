import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MyListingsScreen } from '../screens/requestor/MyListingsScreen';
import { RequesterHomeScreen } from '../screens/requestor/RequesterHomeScreen';
import { RequesterProfileScreen } from '../screens/requestor/RequesterProfileScreen';
import { BrowseListingsScreen } from '../screens/Sitter/BrowseListingsScreen';
import { SitterHomeScreen } from '../screens/Sitter/SitterHomeScreen';
import { SitterProfileScreen } from '../screens/Sitter/SitterProfileScreen';

const Tab = createBottomTabNavigator();

// #region Requester Tab Nav
export const RequesterTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#4CAF50',
                tabBarInactiveTintColor: '#95a5a6',
                tabBarLabelStyle: styles.tabLabel,
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
        >

            <Tab.Screen
                name="Home"
                component={RequesterHomeScreen}
                options={{
                    tabBarIcon: ({ }) => (
                        <TabIcon icon="🏠" />
                    ),
                }}
            />
            <Tab.Screen
                name="MyListings"
                component={MyListingsScreen}
                options={{
                    tabBarLabel: 'My Listings',
                    tabBarIcon: ({ }) => (
                        <Ionicons name="list-outline" size={24} color="#333" style={{ marginRight: 0 }} />
                    ),
                }}
            />
            <Tab.Screen
                name="Browse"
                component={BrowseListingsScreen}
                options={{
                    tabBarIcon: ({ }) => (
                        <TabIcon icon="🔍" />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={RequesterProfileScreen}
                options={{
                    tabBarIcon: ({ }) => (
                        <Ionicons name="person-outline" size={24} color="#333" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

// #region Sitter Tab Nav
export const SitterTabNavigator: React.FC = () => {
    const SavedListingsScreen = require('../screens/SavedListingsScreen').SavedListingsScreen;

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#2196F3',
                tabBarInactiveTintColor: '#95a5a6',
                tabBarLabelStyle: styles.tabLabel,
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tab.Screen
                name="Home"
                component={SitterHomeScreen}
                options={{
                    tabBarIcon: ({ }) => (
                        <TabIcon icon="🏠" />
                    ),
                }}
            />

            <Tab.Screen
                name="Saved"
                component={SavedListingsScreen}
                options={{
                    tabBarIcon: ({ }) => (
                        <TabIcon icon="❤️" />
                    ),
                }}
            />
            <Tab.Screen
                name="Messages"
                component={PlaceholderScreen}
                options={{
                    tabBarIcon: ({ }) => (
                        <TabIcon icon="💬" />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={SitterProfileScreen}
                options={{
                    tabBarIcon: ({ }) => (
                        <Ionicons name="person-outline" size={24} color="#333" />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

// Custom Tab Icon Component
const TabIcon: React.FC<{ icon: string; label?: string }> = ({
    icon,
    label,
}) => {
    return (
        <View style={styles.tabIconContainer}>
            <Text style={[styles.tabIcon]}>
                {icon}
            </Text>
            {label && <Text style={styles.comingSoonLabel}>{label}</Text>}
        </View>
    );
};

// Placeholder Screen for features coming soon
const PlaceholderScreen: React.FC = () => {
    return (
        <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>💬</Text>
            <Text style={styles.placeholderTitle}>Messages</Text>
            <Text style={styles.placeholderText}>
                Chat with requesters and sitters
            </Text>
            <Text style={styles.placeholderSubtext}>Coming Soon!</Text>
        </View>
    );
};

// #region Styles
const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        height: Platform.OS === 'ios' ? 85 : 65,
        paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        paddingTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 10,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    tabIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        fontSize: 24,
        opacity: 0.6,
    },
    tabIconFocused: {
        opacity: 1,
        transform: [{ scale: 1.1 }],
    },
    comingSoonLabel: {
        fontSize: 8,
        color: '#95a5a6',
        marginTop: 2,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 40,
    },
    placeholderEmoji: {
        fontSize: 80,
        marginBottom: 20,
    },
    placeholderTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 12,
    },
    placeholderText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 8,
    },
    placeholderSubtext: {
        fontSize: 18,
        color: '#3498db',
        fontWeight: '600',
        marginTop: 12,
    },
    // #endregion Styles
});
