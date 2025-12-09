import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getAllListings } from '../../services/listingService';
import { Listing, RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

// #region Type
type RequesterHomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'RequesterHome'>;
};
// #endregion Type

// #region Requester Home Comp
export const RequesterHomeScreen: React.FC<RequesterHomeScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'pets' | 'houses'>('all');
    const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
    const [recommendedListings, setRecommendedListings] = useState<Listing[]>([]);

    // #region Mock user data 
    const userName = 'Naledi';
    const pendingRequests = 2;
    const userPreferredType: 'pet' | 'house' | 'both' = 'both';
    const userLocation = 'Johannesburg';


    useFocusEffect(
        useCallback(() => {
            loadListings();
        }, [searchQuery, selectedFilter])
    );
    // #endregion Mock user data

    // #region Load Listings
    const loadListings = async () => {
        try {
            const all = await getAllListings();

            // Featured: top 5 most recent
            setFeaturedListings(all.slice(0, 5));

            const recommended = all
                .slice(5)
                .filter(item => {
                    if (selectedFilter === 'pets' && item.sitterType !== 'pet') return false;
                    if (selectedFilter === 'houses' && item.sitterType !== 'house') return false;
                    return true;
                })
                .filter(item =>
                    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                );

            setRecommendedListings(recommended);
        } catch (error) {
            console.error('Error loading listings:', error);
        }
    };
    // #endregion Load Listings

    // #region Greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };
    // #endregion Greeting based on time

    // #region Render Cards
    const renderFeaturedCard = ({ item, index }: { item: Listing; index: number }) => (
        <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('ListingDetails', { listingId: item.id })}
            activeOpacity={0.9}
        >
            <View style={styles.featuredImageContainer}>
                <Text style={styles.featuredEmoji}>
                    {item.sitterType === 'pet' ? '🐾' : item.sitterType === 'house' ? '🏠' : '🏠🐾'}
                </Text>
            </View>
            <View style={styles.featuredInfo}>
                <Text style={styles.featuredLocation} numberOfLines={1}>
                    📍 {item.location}
                </Text>
                <Text style={styles.featuredDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <Text style={styles.featuredDates}>
                    📅 {new Date(item.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} -
                    {new Date(item.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </Text>
            </View>
        </TouchableOpacity>
    );
    // #endregion Render Cards

    // #region Render Recommended Card
    const renderRecommendedCard = ({ item }: { item: Listing }) => (
        <TouchableOpacity
            style={styles.recommendedCard}
            onPress={() => navigation.navigate('ListingDetails', { listingId: item.id })}
            activeOpacity={0.8}
        >
            <View style={styles.recommendedImageContainer}>
                <Text style={styles.recommendedEmoji}>
                    {item.sitterType === 'pet' ? '🐾' : item.sitterType === 'house' ? '🏠' : '🏠🐾'}
                </Text>
            </View>
            <View style={styles.recommendedInfo}>
                <View style={styles.recommendedHeader}>
                    <Text style={styles.recommendedLocation} numberOfLines={1}>
                        {item.location}
                    </Text>
                    <View style={[styles.typeBadge,
                    { backgroundColor: item.sitterType === 'pet' ? '#4CAF50' : item.sitterType === 'house' ? '#2196F3' : '#FF9800' }
                    ]}>
                        <Text style={styles.typeBadgeText}>
                            {item.sitterType === 'pet' ? 'Pet' : item.sitterType === 'house' ? 'House' : 'Both'}
                        </Text>
                    </View>
                </View>
                <Text style={styles.recommendedDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <Text style={styles.recommendedDates}>
                    {new Date(item.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} -
                    {new Date(item.endDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                </Text>
            </View>
        </TouchableOpacity>
    );
    // #endregion Render Recommended Card

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header / Welcome Bar */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.greeting}>{getGreeting()},</Text>
                        <Text style={styles.userName}>{userName}</Text>

                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => { navigation.navigate('RequesterProfile'); }}
                    >
                        <Text style={styles.profileAvatar}>
                            {userName.charAt(0).toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Filters */}
                <View style={styles.searchSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.filtersContainer}
                    >
                        <TouchableOpacity
                            style={[styles.filterChip, selectedFilter === 'all' && styles.filterChipActive]}
                            onPress={() => setSelectedFilter('all')}
                        >
                            <Text style={[styles.filterChipText, selectedFilter === 'all' && styles.filterChipTextActive]}>
                                All
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterChip, selectedFilter === 'pets' && styles.filterChipActive]}
                            onPress={() => setSelectedFilter('pets')}
                        >
                            <Text style={[styles.filterChipText, selectedFilter === 'pets' && styles.filterChipTextActive]}>
                                🐾 Pets
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterChip, selectedFilter === 'houses' && styles.filterChipActive]}
                            onPress={() => setSelectedFilter('houses')}
                        >
                            <Text style={[styles.filterChipText, selectedFilter === 'houses' && styles.filterChipTextActive]}>
                                🏠 Houses
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Featured Carousel */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Featured Listings</Text>
                    <FlatList
                        horizontal
                        data={featuredListings}
                        renderItem={renderFeaturedCard}
                        keyExtractor={(item) => item.id.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.carousel}
                        snapToInterval={CARD_WIDTH + 16}
                        decelerationRate="fast"
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => navigation.navigate('CreateListing')}
                    >
                        <Text style={styles.quickActionIcon}>➕</Text>
                        <Text style={styles.quickActionText}>Create Listing</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#2196F3' }]}
                        onPress={() => navigation.navigate('MyListings')}
                    >
                        <Text style={styles.quickActionIcon}>📋</Text>
                        <Text style={styles.quickActionText}>My Listings</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom spacing for tab bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};
// #endregion Render
// #endregion Requester Home Comp

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 4,
    },
    notification: {
        fontSize: 13,
        color: '#e74c3c',
        marginTop: 4,
        fontWeight: '600',
    },
    profileButton: {
        position: 'relative',
    },
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#3498db',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 50,
        overflow: 'hidden',
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#e74c3c',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchSection: {
        padding: 16,
        backgroundColor: '#fff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 50,
        marginBottom: 12,
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#2c3e50',
    },
    filtersContainer: {
        flexDirection: 'row',
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterChipActive: {
        backgroundColor: '#3498db',
        borderColor: '#3498db',
    },
    filterChipText: {
        fontSize: 14,
        color: '#7f8c8d',
        fontWeight: '600',
    },
    filterChipTextActive: {
        color: '#fff',
    },
    section: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2c3e50',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    carousel: {
        paddingLeft: 20,
    },
    featuredCard: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 16,
        marginRight: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    featuredImageContainer: {
        height: 180,
        backgroundColor: '#e3f2fd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredEmoji: {
        fontSize: 80,
    },
    featuredInfo: {
        padding: 16,
    },
    featuredLocation: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: 8,
    },
    featuredDescription: {
        fontSize: 14,
        color: '#7f8c8d',
        lineHeight: 20,
        marginBottom: 8,
    },
    featuredDates: {
        fontSize: 12,
        color: '#95a5a6',
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 24,
        gap: 12,
    },
    quickActionButton: {
        flex: 1,
        paddingVertical: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quickActionIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    quickActionText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    recommendedCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    recommendedImageContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recommendedEmoji: {
        fontSize: 40,
    },
    recommendedInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    recommendedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    recommendedLocation: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2c3e50',
        flex: 1,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    typeBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    recommendedDescription: {
        fontSize: 13,
        color: '#7f8c8d',
        lineHeight: 18,
        marginBottom: 6,
    },
    recommendedDates: {
        fontSize: 12,
        color: '#95a5a6',
    },
});
// #endregion Styles