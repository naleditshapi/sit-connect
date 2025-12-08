import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SitterType } from '../types';

//Props for FilterBar
interface FilterBarProps {
    selectedFilter: SitterType | 'all';
    onFilterChange: (filter: SitterType | 'all') => void;
}

// #region FilterBar Comp
// Horizontal scrollable filter buttons - Used in Browse Listings screen
export const FilterBar: React.FC<FilterBarProps> = ({
    selectedFilter,
    onFilterChange,
}) => {
    //Available filter options
    const filters: Array<{ value: SitterType | 'all'; label: string; emoji: string }> = [
        { value: 'all', label: 'All', emoji: '📋' },
        { value: SitterType.PET, label: 'Pet Sitting', emoji: '🐾' },
        { value: SitterType.HOUSE, label: 'House Sitting', emoji: '🏠' },
        { value: SitterType.BOTH, label: 'Both', emoji: '🏠🐾' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {filters.map((filter) => {
                    const isSelected = selectedFilter === filter.value;

                    return (
                        <TouchableOpacity
                            key={filter.value}
                            style={[
                                styles.filterButton,
                                isSelected && styles.filterButtonActive,
                            ]}
                            onPress={() => onFilterChange(filter.value)}
                        >
                            <Text style={styles.emoji}>{filter.emoji}</Text>
                            <Text
                                style={[
                                    styles.filterText,
                                    isSelected && styles.filterTextActive,
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

// #region Styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        gap: 6,
    },
    filterButtonActive: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    emoji: {
        fontSize: 16,
    },
    filterText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
});
// #endregion Styles