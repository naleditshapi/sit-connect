import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ListingCard } from '../components/ListingCard';
import { getSavedListingsForSitter } from '../services/listingService';
import { Listing, RootStackParamList } from '../types';

const MOCK_SITTER_ROLE_ID = 2;

// #region Type
type SavedListingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SavedListings'>;
};
// #endregion Type

// #region Saved Listings Comp
export const SavedListingsScreen: React.FC<SavedListingsScreenProps> = ({ navigation }) => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    // #region Load Saved Listing
    const loadSavedListings = async () => {
        setLoading(true);
        try {
            const data = await getSavedListingsForSitter(MOCK_SITTER_ROLE_ID);
            setListings(data);
            console.log(`❤️ Loaded ${data.length} saved listings`);
        } catch (error) {
            console.error('Error loading saved listings:', error);
        } finally {
            setLoading(false);
        }
    };

    // #region Screen Reload 
    useFocusEffect(
        useCallback(() => {
            console.log('🔄 Saved listings screen focused');
            loadSavedListings();
        }, [])
    );

    // #region Render Saved Listing
    const renderItem = ({ item }: { item: Listing }) => (
        <ListingCard
            listing={item}
            onPress={() => {
                console.log('Opening saved listing details:', item.id);
                navigation.navigate('ListingDetails', { listingId: item.id });
            }}
            showActions={false}
        />
    );
    // #endregion Render Saved Listing

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Saved Listings</Text>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Loading...</Text>
                </View>
            ) : listings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>❤️</Text>
                    <Text style={styles.emptyText}>No saved listings yet</Text>
                    <Text style={styles.emptySubtext}>
                        Browse listings and save the ones you're interested in
                    </Text>
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
// #endregion Saved Listings Comp

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
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
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});