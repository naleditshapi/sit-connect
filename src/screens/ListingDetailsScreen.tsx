import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    getListingById,
    isListingSaved,
    saveListingForSitter,
    unsaveListingForSitter,
} from '../services/listingService';
import { Listing, RootStackParamList, SitterType } from '../types';

const MOCK_SITTER_ROLE_ID = 2;

type ListingDetailsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ListingDetails'>;
    route: RouteProp<RootStackParamList, 'ListingDetails'>;
};

/**
 * Listing Details Screen
 * 
 * Shows full details of a listing
 * Allows sitters to save/unsave the listing
 */
export const ListingDetailsScreen: React.FC<ListingDetailsScreenProps> = ({ route }) => {
    const { listingId } = route.params; // Get listingId from navigation params

    const [listing, setListing] = useState<Listing | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savingInProgress, setSavingInProgress] = useState(false);

    /**
     * Load listing details when component mounts
     */
    useEffect(() => {
        loadListing();
    }, [listingId]); // Re-run if listingId changes

    /**
     * Load listing data and saved status
     */
    const loadListing = async () => {
        try {
            setLoading(true);

            // Fetch listing details
            const data = await getListingById(listingId);
            setListing(data);

            // Check if it's already saved
            if (data) {
                const saved = await isListingSaved(listingId, MOCK_SITTER_ROLE_ID);
                setIsSaved(saved);
            }
        } catch (error) {
            console.error('Error loading listing:', error);
            Alert.alert('Error', 'Failed to load listing');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Toggle save/unsave
     */
    const handleToggleSave = async () => {
        setSavingInProgress(true);
        try {
            if (isSaved) {
                // Unsave
                await unsaveListingForSitter(listingId, MOCK_SITTER_ROLE_ID);
                setIsSaved(false);
                Alert.alert('Removed', 'Listing removed from saved');
            } else {
                // Save
                await saveListingForSitter(listingId, MOCK_SITTER_ROLE_ID);
                setIsSaved(true);
                Alert.alert('Saved', 'Listing saved successfully!');
            }
        } catch (error) {
            console.error('Error toggling save:', error);
            Alert.alert('Error', 'Failed to update saved status');
        } finally {
            setSavingInProgress(false);
        }
    };

    /**
     * Helper: Get color for sitter type badge
     */
    const getSitterTypeColor = (type: SitterType): string => {
        switch (type) {
            case SitterType.PET:
                return '#4CAF50';
            case SitterType.HOUSE:
                return '#2196F3';
            case SitterType.BOTH:
                return '#FF9800';
            default:
                return '#757575';
        }
    };

    /**
     * Helper: Get label for sitter type
     */
    const getSitterTypeLabel = (type: SitterType): string => {
        switch (type) {
            case SitterType.PET:
                return 'Pet Sitting';
            case SitterType.HOUSE:
                return 'House Sitting';
            case SitterType.BOTH:
                return 'Pet & House Sitting';
            default:
                return type;
        }
    };

    /**
     * Helper: Format date for display
     */
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Error state - listing not found
    if (!listing) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.errorText}>Listing not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Main content
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Type Badge */}
                <View
                    style={[
                        styles.badge,
                        { backgroundColor: getSitterTypeColor(listing.sitterType) },
                    ]}
                >
                    <Text style={styles.badgeText}>
                        {getSitterTypeLabel(listing.sitterType)}
                    </Text>
                </View>

                {/* Location Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionIcon}>📍</Text>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionLabel}>Location</Text>
                        <Text style={styles.sectionText}>{listing.location}</Text>
                    </View>
                </View>

                {/* Duration Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionIcon}>📅</Text>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionLabel}>Duration</Text>
                        <Text style={styles.sectionText}>
                            {formatDate(listing.startDate)} - {formatDate(listing.endDate)}
                        </Text>
                    </View>
                </View>

                {/* Description Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionIcon}>📝</Text>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionLabel}>Description</Text>
                        <Text style={styles.descriptionText}>{listing.description}</Text>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, isSaved && styles.saveButtonActive]}
                    onPress={handleToggleSave}
                    disabled={savingInProgress}
                >
                    <Text style={styles.saveButtonText}>
                        {savingInProgress
                            ? 'Please wait...'
                            : isSaved
                                ? '❤️ Saved'
                                : '🤍 Save Listing'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#666',
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 24,
    },
    badgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    sectionIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    sectionContent: {
        flex: 1,
    },
    sectionLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontWeight: '600',
    },
    sectionText: {
        fontSize: 16,
        color: '#333',
    },
    descriptionText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 40,
    },
    saveButtonActive: {
        backgroundColor: '#f44336',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});