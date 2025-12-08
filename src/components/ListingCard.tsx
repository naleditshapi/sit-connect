import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Listing, SitterType } from '../types';
import CollapsibleText from './CollapsibleText';

// #region Props for ListingCard
interface ListingCardProps {
    listing: Listing;
    onPress: () => void;
    showActions?: boolean;  // ? means optional
    onEdit?: () => void;
    onDelete?: () => void;
}

// #region Listing Card Comp
export const ListingCard: React.FC<ListingCardProps> = ({
    listing,
    onPress,
    showActions = false,  // Default to false if not provided
    onEdit,
    onDelete,
}) => {
    //  Get color based on sitter type - Visual cue to quickly identify listing type
    const getSitterTypeColor = (type: SitterType): string => {
        switch (type) {
            case SitterType.PET:
                return '#4CAF50'; // Green
            case SitterType.HOUSE:
                return '#2196F3'; // Blue
            case SitterType.BOTH:
                return '#FF9800'; // Orange
            default:
                return '#757575'; // Gray fallback
        }
    };

    //Get display label for sitter type
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

    // #region Format Date 
    // Converts "2025-01-15" to "15 Jan 2025"
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7} // Visual feedback on press
        >
            {/* Header with type badge */}
            <View style={styles.header}>
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
            </View>

            {/* Location */}
            <Text style={styles.location} numberOfLines={1}>
                <Ionicons name="location-outline" size={20} color="#555" />
                <Ionicons name="location-sharp" size={20} color="#555" />
                {listing.location}
            </Text>

            {/* Dates */}
            <Text style={styles.dates}>
                <Ionicons name="calendar-outline" size={20} color="#555" />
                <Ionicons name="calendar" size={20} color="#555" />
                {formatDate(listing.startDate)} - {formatDate(listing.endDate)}
            </Text>

            {/* Description - limit to 2 lines */}
            <CollapsibleText text={listing.description} style={styles.description} numberOfLines={2} />

            {/* Action buttons (edit/delete) - only show if showActions is true */}
            {showActions && (
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={(e) => {
                            e.stopPropagation(); // Prevent card press when clicking button
                            onEdit?.(); // Call onEdit if it exists (? is optional chaining)
                        }}
                    >
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                        }}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
};

// #region Styles
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Android shadow
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    location: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    dates: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    actions: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});
// #endregion Styles