import React from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SitterType } from "../types";

// #region Types
interface FilterBarProps {
    selectedFilter: SitterType | "all";
    onFilterChange: (filter: SitterType | "all") => void;
}
// #endregion Types

// #region Component
export const FilterBar: React.FC<FilterBarProps> = ({
    selectedFilter,
    onFilterChange,
}) => {

    // #region Filters Defined
    const filters: Array<{ value: SitterType | "all"; label: string }> = [
        { value: "all", label: "All" },
        { value: SitterType.PET, label: "Pet Sitting" },
        { value: SitterType.HOUSE, label: "House Sitting" },
        { value: SitterType.BOTH, label: "Both" },
    ];
    // #endregion Filters Defined

    // #region Render
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {filters.map((f) => {
                    const isActive = selectedFilter === f.value;

                    const scale = new Animated.Value(isActive ? 1 : 0.95);
                    const backgroundColor = isActive ? "#2196F3" : "#fff";

                    const animatePressIn = () => {
                        Animated.spring(scale, {
                            toValue: 0.93,
                            useNativeDriver: true,
                        }).start();
                    };

                    const animatePressOut = () => {
                        Animated.spring(scale, {
                            toValue: 1,
                            friction: 5,
                            useNativeDriver: true,
                        }).start();
                    };

                    return (
                        <Pressable
                            key={f.value}
                            onPressIn={animatePressIn}
                            onPressOut={animatePressOut}
                            onPress={() => onFilterChange(f.value)}
                            style={({ pressed }) => [
                                styles.chip,
                                {
                                    backgroundColor: pressed
                                        ? "#e0f0ff"
                                        : backgroundColor,
                                    borderColor: isActive
                                        ? "#2196F3"
                                        : "#ccc",
                                },
                            ]}
                        >
                            <Animated.View style={{ transform: [{ scale }] }}>
                                <Text
                                    style={[
                                        styles.chipText,
                                        isActive && styles.chipTextActive,
                                    ]}
                                >
                                    {f.label}
                                </Text>
                            </Animated.View>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
    // #endregion Render
};

// #region Styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f8f8f8",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    row: {
        flexDirection: "row",
        paddingHorizontal: 12,
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 22,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 14,
        color: "#444",
        fontWeight: "500",
    },
    chipTextActive: {
        color: "#fff",
        fontWeight: "600",
    },
    // #endregion Styles
});
