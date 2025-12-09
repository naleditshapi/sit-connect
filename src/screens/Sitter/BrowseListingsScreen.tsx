import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { FilterBar } from '../../components/FilterBar';
import { ListingCard } from '../../components/ListingCard';
import { filterListingsByType } from '../../services/listingService';
import { Listing, RootStackParamList, SitterType } from '../../types';

// #region Type
type BrowseListingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'BrowseListings'>;
};
// #endregion Type

// #region Browse Listings Comp
export const BrowseListingsScreen: React.FC<BrowseListingsScreenProps> = ({ navigation }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<SitterType | 'all'>('all');
    const [loading, setLoading] = useState(true);

    // #region Load listings
    const loadListings = async (filter: SitterType | 'all' = 'all') => {
        setLoading(true);
        try {
            const data = await filterListingsByType(filter);
            setListings(data);
            console.log(`Loaded ${data.length} listings for filter: ${filter}`);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };
    // #endregion Load listings

    useFocusEffect(
        useCallback(() => {
            loadListings(selectedFilter);
        }, [selectedFilter])
    );

    // #region Render each card
    const renderItem = ({ item }: { item: Listing }) => (
        <ListingCard
            listing={item}
            onPress={() => navigation.navigate('ListingDetails', { listingId: item.id })}
            showActions={false}
        />
    );
    // #endregion Render each card

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <FilterBar
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
            />

            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Loading...</Text>
                </View>
            ) : listings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No listings found</Text>
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
    // #endregion Render
};
// #endregion Browse Listings Comp

// #region Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },

    menuHeader: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },

    headerIconBtn: {
        padding: 6,
    },

    iconText: { fontSize: 26 },

    listContainer: {
        padding: 16,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emptyText: {
        fontSize: 16,
        color: '#777',
        marginTop: 10,
    },

    emptyEmoji: {
        fontSize: 50,
    },

    profileIcon: {
        width: 30,
        height: 30,
        borderRadius: 20,
    }
});
// #endregion Styles