import DateInput from '@/src/components/CalendarScroll';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createListing } from '../../services/listingService';
import { RootStackParamList, SitterType } from '../../types';

const MOCK_REQUESTER_ROLE_ID = 1;

// #region Type
type CreateListingScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'CreateListing'>;
};
// #endregion Type

// #region Create Listing Comp
export const CreateListingScreen: React.FC<CreateListingScreenProps> = ({ navigation }) => {
    // Form states
    const [sitterType, setSitterType] = useState<SitterType>(SitterType.PET);
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

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
        // Validate first
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Create listing in database
            await createListing(
                MOCK_REQUESTER_ROLE_ID,
                sitterType,
                location,
                startDate,
                endDate,
                description
            );

            // Show success message
            Alert.alert('Success', 'Listing created successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(), // Go back to My Listings
                },
            ]);
        } catch (error) {
            console.error('Error creating listing:', error);
            Alert.alert('Error', 'Failed to create listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // #endregion Handle form submission

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
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.title}>Create New Listing</Text>

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
                                🐾 Pet
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
                                🏠 House
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
                                🏠🐾 Both
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
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Creating...' : 'Create Listing'}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
    // #endregion Render
};
// #endregion Create Listing Comp

// #region Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 20,
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
        backgroundColor: '#4CAF50',
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
});
// #endregion Styles