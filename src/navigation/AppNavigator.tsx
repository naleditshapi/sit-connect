import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';

// #region Import screens
import AboutApp from '../screens/AboutApp';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { LandingScreen } from '../screens/LandingScreen';
import { ListingDetailsScreen } from '../screens/ListingDetailsScreen';
import { ChangePasswordScreen } from '../screens/Profile/ChangePasswordScreen';
import { EditProfileScreen } from '../screens/Profile/EditProfileScreen';
import { NotificationSettingsScreen } from '../screens/Profile/NotificationSettingsScreen';
import { CreateListingScreen } from '../screens/requestor/CreateListingScreen';
import { MyListingsScreen } from '../screens/requestor/MyListingsScreen';
import { SavedListingsScreen } from '../screens/SavedListingsScreen';
import { BrowseListingsScreen } from '../screens/Sitter/BrowseListingsScreen';
import { RequesterTabNavigator, SitterTabNavigator } from './BottomTabNavigator';
// #endregion Import screens

const Stack = createNativeStackNavigator<RootStackParamList>();

// #region App Navigator
export const AppNavigator: React.FC = () => {
    const { loading, logout } = useAuth();

    // #region Loading State
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }
    // #endregion Loading State

    // #region Return Navigator
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Landing"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#2c3e50',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    animation: 'slide_from_right',
                }}
            >
                {/* Auth Screens */}
                <Stack.Screen
                    name="Landing"
                    component={LandingScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUpScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />

                {/* Requester Flow */}
                <Stack.Screen
                    name="RequesterHome"
                    component={MyListingsScreen}
                    options={({ navigation }) => ({
                        title: 'My Listings'
                    })}
                />
                <Stack.Screen
                    name="CreateListing"
                    component={CreateListingScreen}
                    options={{ headerShown: false }}
                />

                {/* Sitter Flow */}
                <Stack.Screen
                    name="SitterHome"
                    component={BrowseListingsScreen}
                    options={({ navigation }) => ({
                        headerShown: false
                    })}
                />
                <Stack.Screen
                    name="BrowseListings"
                    component={BrowseListingsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ListingDetails"
                    component={ListingDetailsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SavedListings"
                    component={SavedListingsScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RequesterTabs"
                    component={RequesterTabNavigator}
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="SitterTabs"
                    component={SitterTabNavigator}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditProfile"
                    component={EditProfileScreen}
                    options={{ title: 'Edit Profile' }}
                />

                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePasswordScreen}
                    options={{ title: 'Change Password' }}
                />

                <Stack.Screen
                    name="NotificationSettings"
                    component={NotificationSettingsScreen}
                    options={{ title: 'Notifications' }}
                />
                <Stack.Screen
                    name="AboutApp"
                    component={AboutApp}
                    options={{ title: 'About SitConnect' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
// #endregion App Navigator

// #region Styles
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#7f8c8d',
    },
    logoutText: {
        color: '#e74c3c',
        fontSize: 16,
        fontWeight: '600',
    },
    // #endregion Styles
});