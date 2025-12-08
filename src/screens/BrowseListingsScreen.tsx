import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FilterBar } from '../components/FilterBar';
import { ListingCard } from '../components/ListingCard';
import { filterListingsByType } from '../services/listingService';
import { Listing, RootStackParamList, SitterType } from '../types';

type BrowseListingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'BrowseListings'>;
};

/**
 * Browse Listings Screen
 * 
 * Sitters use this screen to:
 * - Browse all available listings
 * - Filter by type (pet/house/both/all)
 * - Navigate to details to save
 */
export const BrowseListingsScreen: React.FC<BrowseListingsScreenProps> = ({ navigation }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<SitterType | 'all'>('all');
    const [loading, setLoading] = useState(true);

    /**
     * Load listings based on current filter
     */
    const loadListings = async (filter: SitterType | 'all' = 'all') => {
        setLoading(true);
        try {
            const data = await filterListingsByType(filter);
            setListings(data);
            console.log(`📋 Loaded ${data.length} listings for filter: ${filter}`);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Reload listings when screen comes into focus
     * or when filter changes
     */
    useFocusEffect(
        useCallback(() => {
            console.log('🔄 Screen focused, loading listings...');
            loadListings(selectedFilter);
        }, [selectedFilter]) // Re-run when selectedFilter changes
    );

    /**
     * Handle filter change
     */
    const handleFilterChange = (filter: SitterType | 'all') => {
        console.log('🔍 Filter changed to:', filter);
        setSelectedFilter(filter);
        // loadListings will be called by useFocusEffect
    };

    /**
     * Render each listing item
     */
    const renderItem = ({ item }: { item: Listing }) => (
        <ListingCard
            listing={item}
            onPress={() => {
                console.log('Opening listing details:', item.id);
                navigation.navigate('ListingDetails', { listingId: item.id });
            }}
            showActions={false} // Sitters can't edit/delete
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Browse Listings</Text>
                <TouchableOpacity
                    style={styles.savedButton}
                    onPress={() => navigation.navigate('SavedListings')}
                >
                    <Text style={styles.savedButtonText}>❤️ Saved</Text>
                </TouchableOpacity>
            </View>

            {/* Filter Bar */}
            <FilterBar
                selectedFilter={selectedFilter}
                onFilterChange={handleFilterChange}
            />

            {/* Listings List */}
            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Loading...</Text>
                </View>
            ) : listings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>🔍</Text>
                    <Text style={styles.emptyText}>No listings found</Text>
                    <Text style={styles.emptySubtext}>Try changing your filter</Text>
                </View>
            ) : (
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
    savedButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    savedButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
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
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
    },
});

/**
 * Key Concepts:
 * 
 * 1. Filter State: selectedFilter controls what's displayed
 * 2. Effect Dependencies: [selectedFilter] makes effect re-run on filter change
 * 3. Component Composition: FilterBar + ListingCard work together
 * 4. Navigation with Params: Pass listingId to details screen
 */