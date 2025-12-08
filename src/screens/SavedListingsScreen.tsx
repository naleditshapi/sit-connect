import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../types';

// Import screens
import { BrowseListingsScreen } from '../screens/BrowseListingsScreen';
import { CreateListingScreen } from '../screens/CreateListingScreen';
import { ListingDetailsScreen } from '../screens/ListingDetailsScreen';
import { MyListingsScreen } from '../screens/MyListingsScreen';
import { RoleSelectionScreen } from '../screens/RoleSelectionScreen';

/**
 * Navigation Setup
 * 
 * Think of this like a map of your app:
 * - Each screen is a location
 * - Navigation takes you between locations
 * - Stack = screens pile on top of each other (can go back)
 */

// Create the stack navigator with our type definitions
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator component
 * This wraps your entire app and handles all routing
 */
export const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="RoleSelection"
                screenOptions={{
                    // Default styling for all screens
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerTintColor: '#333',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    // Animation between screens
                    animation: 'slide_from_right',
                }}
            >
                {/* Role Selection Screen - Entry point */}
                <Stack.Screen
                    name="RoleSelection"
                    component={RoleSelectionScreen}
                    options={{
                        headerShown: false, // Hide header for splash-like screen
                    }}
                />

                {/* Requester Flow */}
                <Stack.Screen
                    name="RequesterHome"
                    component={MyListingsScreen}
                    options={({ navigation }) => ({
                        title: 'My Listings',
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('RoleSelection')}
                                style={{ marginLeft: 8 }}
                            >
                                <Text style={{ color: '#2196F3', fontSize: 16 }}>← Back</Text>
                            </TouchableOpacity>
                        ),
                    })}
                />

                <Stack.Screen
                    name="CreateListing"
                    component={CreateListingScreen}
                    options={{ title: 'Create Listing' }}
                />

                {/* Sitter Flow */}
                <Stack.Screen
                    name="SitterHome"
                    component={BrowseListingsScreen}
                    options={({ navigation }) => ({
                        title: 'Browse Listings',
                        headerLeft: () => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate('RoleSelection')}
                                style={{ marginLeft: 8 }}
                            >
                                <Text style={{ color: '#2196F3', fontSize: 16 }}>← Back</Text>
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
        </NavigationContainer>
    );
};

/**
 * SavedListingsScreen Component
 */
export const SavedListingsScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text>Saved Listings Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

/**
 * 
 * 1. NavigationContainer: Wraps everything, manages navigation state
 * 2. Stack.Navigator: Defines stack of screens (like a deck of cards)
 * 3. Stack.Screen: Individual screens in the stack
 * 
 * Navigation happens via:
 * - navigation.navigate('ScreenName')
 * - navigation.goBack()
 * - navigation.push('ScreenName')
 * 
 * Each screen component automatically receives a 'navigation' prop
 */