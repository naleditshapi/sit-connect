import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';

// Import screens
import { BrowseListingsScreen } from '../screens/BrowseListingsScreen';
import { CreateListingScreen } from '../screens/CreateListingScreen';
import { EditListingScreen } from '../screens/EditListingScreen';
import { LandingScreen } from '../screens/LandingScreen';
import { ListingDetailsScreen } from '../screens/ListingDetailsScreen';
import { MyListingsScreen } from '../screens/MyListingsScreen';
import { SavedListingsScreen } from '../screens/SavedListingsScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const NavigationContent: React.FC = () => {
    const { logout } = useAuth();

    return (
        <Stack.Navigator
            initialRouteName="Landing"
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#333',
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
                options={{ title: 'Sign Up' }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ title: 'Log In' }}
            />

            {/* Requester Flow */}
            <Stack.Screen
                name="RequesterHome"
                component={MyListingsScreen}
                options={({ navigation }) => ({
                    title: 'My Listings',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                logout();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Landing' }],
                                });
                            }}
                            style={{ marginLeft: 8 }}
                        >
                            <Text style={{ color: '#f44336', fontSize: 16 }}>Logout</Text>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="CreateListing"
                component={CreateListingScreen}
                options={{ title: 'Create Listing' }}
            />
            <Stack.Screen
                name="EditListing"
                component={EditListingScreen}
                options={{ title: 'Edit Listing' }}
            />

            {/* Sitter Flow */}
            <Stack.Screen
                name="SitterHome"
                component={BrowseListingsScreen}
                options={({ navigation }) => ({
                    title: 'Browse Listings',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => {
                                logout();
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Landing' }],
                                });
                            }}
                            style={{ marginLeft: 8 }}
                        >
                            <Text style={{ color: '#f44336', fontSize: 16 }}>Logout</Text>
                        </TouchableOpacity>
                    ),
                })}
            />
            <Stack.Screen
                name="BrowseListings"
                component={BrowseListingsScreen}
                options={{ title: 'Browse Listings' }}
            />
            <Stack.Screen
                name="ListingDetails"
                component={ListingDetailsScreen}
                options={{ title: 'Listing Details' }}
            />
            <Stack.Screen
                name="SavedListings"
                component={SavedListingsScreen}
                options={{ title: 'Saved Listings' }}
            />
        </Stack.Navigator>
    );
};

export const AppNavigator: React.FC = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <NavigationContent />
            </NavigationContainer>
        </AuthProvider>
    );
};