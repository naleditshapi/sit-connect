import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getAllListings } from '../../services/listingService';
import { Listing, RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

// #region Type
type SitterHomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'SitterHome'>;
};
// #endregion Type

// #region Interface for accepted bookings
interface AcceptedBooking extends Listing {
    acceptedAt: string;
}
// #endregion Interface for accepted bookings

// #region Sitter Home Comp
export const SitterHomeScreen: React.FC<SitterHomeScreenProps> = ({ navigation }) => {
    const [availableRequests, setAvailableRequests] = useState<Listing[]>([]);
    const [acceptedBookings, setAcceptedBookings] = useState<AcceptedBooking[]>([]); // ⭐ NEW
    const [declinedListingIds, setDeclinedListingIds] = useState<number[]>([]); // ⭐ NEW
    const [isOnline, setIsOnline] = useState(true);

    const userName = 'Naledi';
    const newRequests = 3;
    const stats = {
        rating: 4.9,
        completedBookings: 87,
        totalEarnings: 'R 12,500',
    };

    useFocusEffect(
        useCallback(() => {
            loadRequests();
        }, [])
    );

    // #region Load Requests
    const loadRequests = async () => {
        try {
            const all = await getAllListings();
            setAvailableRequests(all);
        } catch (error) {
            console.error('Error loading requests:', error);
        }
    };
    // #endregion Load Requests

    // #region Greeting Function
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };
    // #endregion Greeting Function

    //#region Handle accept booking
    const handleAcceptBooking = (listing: Listing) => {
        Alert.alert(
            'Accept Booking',
            `Accept this ${listing.sitterType === 'pet' ? 'pet' : listing.sitterType === 'house' ? 'house' : 'pet and house'} sitting job?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Accept',
                    onPress: () => {
                        // Add to accepted bookings
                        const acceptedBooking: AcceptedBooking = {
                            ...listing,
                            acceptedAt: new Date().toISOString(),
                        };
                        setAcceptedBookings([...acceptedBookings, acceptedBooking]);

                        // Remove from available requests
                        setAvailableRequests(availableRequests.filter(req => req.id !== listing.id));

                        // Show success alert
                        Alert.alert(
                            'Booking Accepted! 🎉',
                            'This booking has been added to your upcoming bookings.',
                            [{ text: 'OK' }]
                        );
                    },
                },
            ]
        );
    };

    // #region Handle decline booking
    const handleDeclineBooking = (listing: Listing) => {
        Alert.alert(
            'Decline Booking',
            'Are you sure you want to decline this booking?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Decline',
                    style: 'destructive',
                    onPress: () => {
                        // Add to declined list
                        setDeclinedListingIds([...declinedListingIds, listing.id]);

                        // Remove from available requests
                        setAvailableRequests(availableRequests.filter(req => req.id !== listing.id));

                        // Show alert
                        Alert.alert(
                            'Booking Declined',
                            'This booking has been removed from your recommendations.',
                            [{ text: 'OK' }]
                        );
                    },
                },
            ]
        );
    };

    // #region Handle message button
    const handleMessageOwner = () => {
        Alert.alert(
            'Messages',
            'Redirecting to messages...',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('Messages' as never);
                        console.log('Navigate to Messages tab');
                    },
                },
            ]
        );
    };

    // #region Handle navigate button
    const handleNavigate = () => {
        Alert.alert(
            'Navigation',
            'Maps location coming soon!',
            [{ text: 'OK' }]
        );
    };

    const renderRequestCard = ({ item }: { item: Listing }) => (
        <TouchableOpacity
            style={styles.requestCard}
            onPress={() => navigation.navigate('ListingDetails', { listingId: item.id })}
            activeOpacity={0.9}
        >
            <View style={styles.requestImageContainer}>
                <Text style={styles.requestEmoji}>
                    {item.sitterType === 'pet' ? '🐾' : item.sitterType === 'house' ? '🏠' : '🏠🐾'}
                </Text>
            </View>
            <View style={styles.requestInfo}>
                <View style={styles.requestHeader}>
                    <Text style={styles.requestType}>
                        {item.sitterType === 'pet' ? 'Pet Sitting' : item.sitterType === 'house' ? 'House Sitting' : 'Both'}
                    </Text>
                    <Text style={styles.requestPrice}>R {item.pricePerDay}/day</Text>
                </View>
                <Text style={styles.requestLocation} numberOfLines={1}>
                    📍 {item.location}
                </Text>
                <Text style={styles.requestDates}>
                    📅 {new Date(item.startDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} -
                    {new Date(item.endDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                </Text>
                <Text style={styles.requestDescription} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.requestActions}>
                    {/* Accept button */}
                    <TouchableOpacity
                        style={styles.acceptButton}
                        onPress={(e) => {
                            e.stopPropagation(); // Prevent card press
                            handleAcceptBooking(item);
                        }}
                    >
                        <Text style={styles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                    {/* Decline button */}
                    <TouchableOpacity
                        style={styles.declineButton}
                        onPress={(e) => {
                            e.stopPropagation(); // Prevent card press
                            handleDeclineBooking(item);
                        }}
                    >
                        <Text style={styles.declineButtonText}>Decline</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    // #region Accepted booking card
    const renderAcceptedBooking = (booking: AcceptedBooking, _index: number) => (
        <View key={booking.id} style={styles.bookingCard}>
            <Text style={[styles.statusLabel, styles.statusConfirmed]}>Confirmed</Text>
            <Text style={styles.bookingTitle}>
                {booking.sitterType === 'pet' ? '🐾 Pet Sitting' : booking.sitterType === 'house' ? '🏠 House Sitting' : '🏠🐾 Pet & House Sitting'}
            </Text>
            <Text style={styles.bookingDetail}>📍 {booking.location}</Text>
            <Text style={styles.bookingDetail}>
                📅 {new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} -
                {new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
            <Text style={styles.bookingDetail}>💰 R {booking.pricePerDay}/day</Text>
            <View style={styles.bookingActions}>
                {/*  Message button */}
                <TouchableOpacity
                    style={styles.bookingActionButton}
                    onPress={handleMessageOwner}
                >
                    <Text style={styles.bookingActionText}>💬 Message</Text>
                </TouchableOpacity>
                {/* Navigate button shows coming soon */}
                <TouchableOpacity
                    style={styles.bookingActionButton}
                    onPress={handleNavigate}
                >
                    <Text style={styles.bookingActionText}>📍 Navigate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    // #endregion Accepted booking card

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.greeting}>{getGreeting()},</Text>
                        <Text style={styles.userName}>{userName}! 👋</Text>
                        <View style={styles.statusContainer}>
                            <TouchableOpacity
                                style={[styles.statusBadge, isOnline ? styles.statusOnline : styles.statusOffline]}
                                onPress={() => setIsOnline(!isOnline)}
                            >
                                <View style={[styles.statusDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
                                <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => navigation.navigate('SitterProfile')}
                    >
                        <Text style={styles.profileAvatar}>
                            {userName.charAt(0).toUpperCase()}
                        </Text>
                        {newRequests > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>{newRequests}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#2196F3' }]}
                        onPress={() => Alert.alert("Coming Soon", "Your schedule feature will be available soon!")}
                    >
                        <Text style={styles.quickActionIcon}>📋</Text>
                        <Text style={styles.quickActionText}>New Requests</Text>
                        {availableRequests.length > 0 && (
                            <View style={styles.actionBadge}>
                                <Text style={styles.actionBadgeText}>{availableRequests.length}</Text>
                            </View>

                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => Alert.alert("Coming Soon", "Your schedule feature will be available soon!")}
                    >
                        <Text style={styles.quickActionIcon}>📅</Text>
                        <Text style={styles.quickActionText}>My Schedule</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#FF9800' }]}
                        onPress={handleMessageOwner}
                    >
                        <Text style={styles.quickActionIcon}>💬</Text>
                        <Text style={styles.quickActionText}>Messages</Text>
                    </TouchableOpacity>
                </View>

                {/* Performance Highlights */}
                <View style={styles.performanceSection}>
                    <Text style={styles.sectionTitle}>Your Performance</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Text style={styles.statIcon}>⭐</Text>
                            <Text style={styles.statValue}>{stats.rating}</Text>
                            <Text style={styles.statLabel}>Rating</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statIcon}>✅</Text>
                            <Text style={styles.statValue}>{stats.completedBookings}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statIcon}>💰</Text>
                            <Text style={styles.statValue}>{stats.totalEarnings}</Text>
                            <Text style={styles.statLabel}>Earned</Text>
                        </View>
                    </View>
                </View>

                {/* ⭐ UPDATED: Active Bookings - now shows accepted bookings */}
                {acceptedBookings.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
                            <Text style={styles.sectionCount}>{acceptedBookings.length}</Text>
                        </View>
                        {acceptedBookings.map((booking, index) => renderAcceptedBooking(booking, index))}
                    </View>
                )}

                {/* Recommended Requests */}
                {availableRequests.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recommended for You</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('BrowseListings')}>
                                <Text style={styles.seeAllText}>See All →</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            horizontal
                            data={availableRequests.slice(0, 5)}
                            renderItem={renderRequestCard}
                            keyExtractor={(item) => item.id.toString()}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.requestsCarousel}
                            snapToInterval={CARD_WIDTH + 16}
                            decelerationRate="fast"
                        />
                    </View>
                )}

                {/* Empty state if no requests */}
                {availableRequests.length === 0 && acceptedBookings.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyEmoji}>📭</Text>
                        <Text style={styles.emptyText}>No available bookings right now</Text>
                        <Text style={styles.emptySubtext}>Check back later for new opportunities!</Text>
                    </View>
                )}

                {/* Achievements */}
                <View style={styles.achievementsSection}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.achievementsList}>
                        <View style={styles.achievementBadge}>
                            <Text style={styles.achievementIcon}>🏆</Text>
                            <Text style={styles.achievementText}>5-Star Sitter</Text>
                        </View>
                        <View style={styles.achievementBadge}>
                            <Text style={styles.achievementIcon}>🎯</Text>
                            <Text style={styles.achievementText}>50+ Bookings</Text>
                        </View>
                        <View style={styles.achievementBadge}>
                            <Text style={styles.achievementIcon}>⚡</Text>
                            <Text style={styles.achievementText}>Quick Responder</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
    // #endregion Render
};
// #endregion Sitter Home Comp

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    headerLeft: {
        flex: 1
    },
    greeting: {
        fontSize: 16,
        color: '#7f8c8d'
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        marginTop: 4
    },
    statusContainer: {
        marginTop: 8
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start'
    },
    statusOnline: {
        backgroundColor: '#d4edda'
    },
    statusOffline: {
        backgroundColor: '#f8d7da'
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6
    },
    dotOnline: {
        backgroundColor: '#28a745'
    },
    dotOffline: {
        backgroundColor: '#dc3545'
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2c3e50'
    },
    profileButton: {
        position: 'relative'
    },
    profileAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2196F3',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 50
    },
    notificationBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#e74c3c', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
    notificationBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
    alertBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3cd', padding: 16, marginHorizontal: 16, marginTop: 16, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#ffc107' },
    alertIcon: { fontSize: 24, marginRight: 12 },
    alertText: { flex: 1, fontSize: 14, color: '#856404', fontWeight: '600' },
    quickActions: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 24, gap: 12 },
    quickActionButton: { flex: 1, paddingVertical: 20, borderRadius: 12, alignItems: 'center', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    quickActionIcon: { fontSize: 24, marginBottom: 8 },
    quickActionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    actionBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#e74c3c', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
    actionBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
    performanceSection: { marginTop: 24, paddingHorizontal: 20 },
    section: { marginTop: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
    sectionCount: { fontSize: 16, fontWeight: '600', color: '#2196F3' },
    seeAllText: { fontSize: 14, color: '#2196F3', fontWeight: '600' },
    statsGrid: { flexDirection: 'row', gap: 12, marginTop: 12 },
    statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    statIcon: { fontSize: 28, marginBottom: 8 },
    statValue: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
    statLabel: { fontSize: 12, color: '#95a5a6' },
    bookingCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
    bookingStatus: { marginBottom: 12 },
    statusLabel: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600' },
    statusConfirmed: { backgroundColor: '#d4edda', color: '#155724' },
    bookingTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
    bookingDetail: { fontSize: 14, color: '#7f8c8d', marginBottom: 4 },
    bookingActions: { flexDirection: 'row', marginTop: 12, gap: 8 },
    bookingActionButton: { flex: 1, backgroundColor: '#f8f9fa', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    bookingActionText: { fontSize: 13, color: '#2c3e50', fontWeight: '600' },
    requestsCarousel: { paddingLeft: 20 },
    requestCard: { width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: 16, marginRight: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    requestImageContainer: { height: 140, backgroundColor: '#e3f2fd', justifyContent: 'center', alignItems: 'center' },
    requestEmoji: { fontSize: 60 },
    requestInfo: { padding: 16 },
    requestHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    requestType: { fontSize: 14, fontWeight: 'bold', color: '#2196F3' },
    requestPrice: { fontSize: 14, fontWeight: 'bold', color: '#27ae60' },
    requestLocation: { fontSize: 14, color: '#2c3e50', fontWeight: '600', marginBottom: 4 },
    requestDates: { fontSize: 12, color: '#95a5a6', marginBottom: 8 },
    requestDescription: { fontSize: 13, color: '#7f8c8d', lineHeight: 18, marginBottom: 12 },
    requestActions: { flexDirection: 'row', gap: 8 },
    acceptButton: { flex: 1, backgroundColor: '#27ae60', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    acceptButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    declineButton: { flex: 1, backgroundColor: '#f8f9fa', paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0' },
    declineButtonText: { color: '#95a5a6', fontSize: 13, fontWeight: '600' },
    emptyState: { marginTop: 60, alignItems: 'center', paddingHorizontal: 40 },
    emptyEmoji: { fontSize: 64, marginBottom: 16 },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
    emptySubtext: { fontSize: 14, color: '#95a5a6', textAlign: 'center' },
    achievementsSection: { marginTop: 24, paddingHorizontal: 20, marginBottom: 20 },
    achievementsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
    achievementBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    achievementIcon: { fontSize: 20, marginRight: 8 },
    achievementText: { fontSize: 13, fontWeight: '600', color: '#2c3e50' },
});
// #endregion Styles