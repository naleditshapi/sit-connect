import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ListingCard } from '../components/ListingCard';
import { deleteListing, getListingsByCreator } from '../services/listingService';
import { Listing, RootStackParamList } from '../types';

/**
 * Mock user ID
 * In a real app, this would come from authentication
 */
const MOCK_REQUESTER_ROLE_ID = 1;

type MyListingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'MyListings'>;
};

/**
 * My Listings Screen
 * Shows all listings created by the current user (requester)
 */
export const MyListingsScreen: React.FC<MyListingsScreenProps> = ({ navigation }) => {
    // State to store listings
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    /**
     * Load listings from database
     */
    const loadListings = async () => {
        try {
            setLoading(true);
            const data = await getListingsByCreator(MOCK_REQUESTER_ROLE_ID);
            setListings(data);
            console.log(`📋 Loaded ${data.length} listings`);
        } catch (error) {
            console.error('Error loading listings:', error);
            Alert.alert('Error', 'Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    /**
     * useFocusEffect - runs when screen comes into focus
     * 
     * Different from useEffect:
     * - useEffect: Runs when component mounts
     * - useFocusEffect: Runs when screen becomes visible (even when navigating back)
     * 
     * Why we need this:
     * If you create a listing and come back, we want to reload the list
     */
    useFocusEffect(
        useCallback(() => {
            console.log('🔄 Screen focused, loading listings...');
            loadListings();
        }, []) // Empty array = use same callback every time
    );

    /**
     * Handle delete with confirmation
     */
    const handleDelete = (listingId: number) => {
        Alert.alert(
            'Delete Listing',
            'Are you sure you want to delete this listing?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteListing(listingId);
                            // Reload listings after delete
                            loadListings();
                            Alert.alert('Success', 'Listing deleted');
                        } catch (error) {
                            console.error('Error deleting listing:', error);
                            Alert.alert('Error', 'Failed to delete listing');
                        }
                    },
                },
            ]
        );
    };

    /**
     * Render each listing item
     * Used by FlatList
     */
    const renderItem = ({ item }: { item: Listing }) => (
        <ListingCard
            listing={item}
            onPress={() => {
                console.log('Pressed listing:', item.id);
                navigation.navigate('ListingDetails', { listingId: item.id });
            }}
            showActions={true} // Show edit/delete buttons
            onEdit={() => {
                console.log('Edit listing:', item.id);
                navigation.navigate('EditListing', { listingId: item.id });
            }}
            onDelete={() => handleDelete(item.id)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with title and create button */}
            <View style={styles.header}>
                <Text style={styles.title}>My Listings</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => navigation.navigate('CreateListing')}
                >
                    <Text style={styles.createButtonText}>+ New</Text>
                </TouchableOpacity>
            </View>

            {/* Loading state */}
            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Loading...</Text>
                </View>
            ) : listings.length === 0 ? (
                // Empty state - no listings yet
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>📝</Text>
                    <Text style={styles.emptyText}>No listings yet</Text>
                    <TouchableOpacity
                        style={styles.emptyButton}
                        onPress={() => navigation.navigate('CreateListing')}
                    >
                        <Text style={styles.emptyButtonText}>Create Your First Listing</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // List of listings
                <FlatList
                    data={listings}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    createButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    createButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    listContainer: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

/**
 * Key Concepts:
 * 
 * 1. FlatList: Efficient list rendering (virtualized)
 * 2. useFocusEffect: Reload data when screen comes into focus
 * 3. Alert.alert: Native confirmation dialogs
 * 4. Conditional Rendering: loading ? <Loading /> : <List />
 * 5. Empty States: Better UX when no data
 */