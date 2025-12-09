import DateInput from '@/src/components/CalendarScroll';
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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getListingById, updateListing } from '../../services/listingService';
import { RootStackParamList, SitterType } from '../../types';

type EditListingScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'EditListing'>;
    route: RouteProp<RootStackParamList, 'EditListing'>;
};

// #region Edit Listing Screen
export const EditListingScreen: React.FC<EditListingScreenProps> = ({
    navigation,
    route,
}) => {
    const { listingId } = route.params;

    // Form state
    const [sitterType, setSitterType] = useState<SitterType>(SitterType.PET);
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');

    // UI state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // #region Load existing listing data when component mounts
    useEffect(() => {
        loadListing();
    }, [listingId]);


    // #region Fetch listing and populate form
    const loadListing = async () => {
        try {
            setLoading(true);
            const listing = await getListingById(listingId);

            if (listing) {
                // Pre-fill form with existing data
                setSitterType(listing.sitterType);
                setLocation(listing.location);
                setStartDate(listing.startDate);
                setEndDate(listing.endDate);
                setDescription(listing.description);
            } else {
                Alert.alert('Error', 'Listing not found');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error loading listing:', error);
            Alert.alert('Error', 'Failed to load listing');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };
    // #endregion Fetch listing and populate form
    // #endregion Load existing listing data when component mounts

    // #region Validate form data
    const validateForm = (): boolean => {
        if (!location.trim()) {
            Alert.alert('Error', 'Please enter a location');
            return false;
        }
        if (!startDate.trim() || !endDate.trim()) {
            Alert.alert('Error', 'Please enter both start and end dates');
            return false;
        }
        if (!description.trim()) {
            Alert.alert('Error', 'Please enter a description');
            return false;
        }
        return true;
    };
    // #endregion Validate form data

    // #region Handle form submission
    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            await updateListing(
                listingId,
                sitterType,
                location,
                startDate,
                endDate,
                description
            );

            Alert.alert('Success', 'Listing updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Error updating listing:', error);
            Alert.alert('Error', 'Failed to update listing. Please try again.');
        } finally {
            setSaving(false);
        }
    };
    // #endregion Handle form submission

    // #region Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.loadingText}>Loading listing...</Text>
                </View>
            </SafeAreaView>
        );
    }
    // #endregion Loading state

    // #region Handle date changes
    const handleStartDateChange = (date: string) => {
        setStartDate(date);

        // If end date is selected and now invalid, clear it or warn
        if (endDate && new Date(date) > new Date(endDate)) {
            setEndDate("");
            Alert.alert("Invalid Date", "End date cannot be before the start date.");
        }
    };

    const handleEndDateChange = (date: string) => {
        if (!startDate) {
            Alert.alert(
                "Select Start Date First",
                "Please choose a start date before selecting the end date."
            );
            return;
        }

        if (new Date(date) < new Date(startDate)) {
            Alert.alert(
                "Invalid End Date",
                "End date cannot be earlier than the start date."
            );
            return;
        }

        setEndDate(date);
    };
    // #endregion Handle date changes

    // #region Render
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.title}>Edit Listing</Text>

                {/* Sitter Type Selector */}
                <Text style={styles.label}>Sitter Type *</Text>
                <View style={styles.typeButtons}>
                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            sitterType === SitterType.PET && styles.typeButtonActive,
                        ]}
                        onPress={() => setSitterType(SitterType.PET)}
                    >
                        <Text
                            style={[
                                styles.typeButtonText,
                                sitterType === SitterType.PET && styles.typeButtonTextActive,
                            ]}
                        >
                            Pet
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            sitterType === SitterType.HOUSE && styles.typeButtonActive,
                        ]}
                        onPress={() => setSitterType(SitterType.HOUSE)}
                    >
                        <Text
                            style={[
                                styles.typeButtonText,
                                sitterType === SitterType.HOUSE && styles.typeButtonTextActive,
                            ]}
                        >
                            House
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.typeButton,
                            sitterType === SitterType.BOTH && styles.typeButtonActive,
                        ]}
                        onPress={() => setSitterType(SitterType.BOTH)}
                    >
                        <Text
                            style={[
                                styles.typeButtonText,
                                sitterType === SitterType.BOTH && styles.typeButtonTextActive,
                            ]}
                        >
                            Both
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Location Input */}
                <Text style={styles.label}>Location *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Cape Town, Western Cape"
                    value={location}
                    onChangeText={setLocation}
                    autoCapitalize="words"
                />

                {/* Start Date Input */}
                <DateInput
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                />

                {/* End Date Input */}
                < DateInput
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                />

                {/* Description Input */}
                <Text style={styles.label}>Description *</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe your sitting needs..."
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, saving && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={saving}
                >
                    <Text style={styles.submitButtonText}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
    // #endregion Render
};

// #region Styles
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    typeButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    typeButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    typeButtonActive: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    typeButtonText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
    },
    typeButtonTextActive: {
        color: '#fff',
    },
    submitButton: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    //#endregion Styles
});
// #endregion Edit Listing Screen