import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FilterBar } from '../../components/FilterBar'; // ⭐ Added
import { ListingCard } from '../../components/ListingCard';
import { deleteListing, getListingsByCreator } from '../../services/listingService';
import { Listing, RootStackParamList, SitterType } from '../../types';

// Mock user ID
const MOCK_REQUESTER_ROLE_ID = 1;

// #region Type
type MyListingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'MyListings'>;
};

// #region My Listings Comp
export const MyListingsScreen: React.FC<MyListingsScreenProps> = ({ navigation }) => {
    // State to store listings
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<SitterType | 'all'>('all');

    // #region Load listings 
    const loadListings = async () => {
        try {
            setLoading(true);
            const data = await getListingsByCreator(MOCK_REQUESTER_ROLE_ID);

            // ⭐ Apply filtering
            const filtered = selectedFilter === 'all'
                ? data
                : data.filter((item) => item.sitterType === selectedFilter);

            setListings(filtered);
            console.log(`📋 Loaded ${filtered.length} listings`);
        } catch (error) {
            console.error('Error loading listings:', error);
            Alert.alert('Error', 'Failed to load listings');
        } finally {
            setLoading(false);
        }
    };
    // #endregion Load listings

    // #region Pull-to-refresh
    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const data = await getListingsByCreator(MOCK_REQUESTER_ROLE_ID);

            const filtered = selectedFilter === 'all'
                ? data
                : data.filter((item) => item.sitterType === selectedFilter);

            setListings(filtered);

            console.log(`🔄 Refreshed ${filtered.length} listings`);
        } catch (error) {
            console.error('Error refreshing listings:', error);
        } finally {
            setRefreshing(false);
        }
    };
    // #endregion Pull-to-refresh



    // #region Screen Reload 
    useFocusEffect(
        useCallback(() => {
            console.log('🔄 Screen focused, loading listings...');
            loadListings();
        }, [selectedFilter]) // ⭐ Added filter dependency
    );
    // #endregion Screen Reload

    // #region Handle edit

    const handleEdit = (listingId: number) => {
        console.log('📝 Editing listing:', listingId);
        navigation.navigate('EditListing', { listingId });
    };

    // #region Handle delete
    const handleDelete = (listingId: number) => {
        Alert.alert(
            'Delete Listing',
            'Are you sure you want to delete this listing? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteListing(listingId);
                            loadListings();
                            Alert.alert('Success', 'Listing deleted successfully');
                        } catch (error) {
                            console.error('Error deleting listing:', error);
                            Alert.alert('Error', 'Failed to delete listing. Please try again.');
                        }
                    },
                },
            ]
        );
    };
    // #endregion Handle delete

    // #region Render each card
    const renderItem = ({ item }: { item: Listing }) => (
        <ListingCard
            listing={item}
            onPress={() =>
                navigation.navigate('ListingDetails', { listingId: item.id })
            }
            showActions={true}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
        />
    );
    // #endregion Render each card

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>

                        {!loading && (
                            <Text style={styles.subtitle}>
                                {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => navigation.navigate('CreateListing')}
                    >
                        <Text style={styles.createButtonText}>+ New</Text>
                    </TouchableOpacity>
                </View>

                {/* ⭐ FILTER BAR ADDED */}
                <FilterBar
                    selectedFilter={selectedFilter}
                    onFilterChange={(value) => setSelectedFilter(value)}
                />

                {/* Loading */}
                {loading ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Loading...</Text>
                    </View>
                ) : listings.length === 0 ? (
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
                    <FlatList
                        data={listings}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#4CAF50']}
                                tintColor="#4CAF50"
                            />
                        }
                    />
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    keyboardView: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
    createButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    createButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    listContainer: { padding: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyEmoji: { fontSize: 64, marginBottom: 16 },
    emptyText: { fontSize: 18, color: '#666', marginBottom: 24 },
    emptyButton: { backgroundColor: '#4CAF50', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
    emptyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});