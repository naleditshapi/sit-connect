import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    Modal,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
    label: string;
    value: string;
    onChange: (val: string) => void;
}

export default function DateInput({ label, value, onChange }: Props) {
    const [show, setShow] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const onSelect = (event: any, selectedDate?: Date) => {
        if (Platform.OS === "android") {
            setShow(false);
        }

        if (selectedDate) {
            const formatted = selectedDate.toISOString().split("T")[0];
            onChange(formatted);
        }
    };

    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ marginBottom: 6, color: "#000" }}>{label}</Text>

            <TouchableOpacity
                style={{
                    borderWidth: 1,
                    padding: 12,
                    borderRadius: 6,
                    borderColor: "#ccc",
                }}
                onPress={() => setShow(true)}
            >
                <Text style={{ color: "#000" }}>{value || "Select date"}</Text>
            </TouchableOpacity>

            {/* iOS modal */}
            {Platform.OS === "ios" && show && (
                <Modal transparent animationType="slide" visible={show}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-end",
                            backgroundColor: "rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#fff",
                                padding: 20,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}
                        >
                            <DateTimePicker
                                value={value ? new Date(value) : today}
                                mode="date"
                                display="spinner"
                                minimumDate={today}
                                onChange={onSelect}
                                textColor="#000" // <-- iOS ONLY
                            />

                            <Pressable
                                onPress={() => setShow(false)}
                                style={{
                                    marginTop: 10,
                                    padding: 12,
                                    backgroundColor: "#007AFF",
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{ color: "#fff", textAlign: "center" }}>Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Android popup */}
            {Platform.OS === "android" && show && (
                <DateTimePicker
                    value={value ? new Date(value) : today}
                    mode="date"
                    display="default"
                    minimumDate={today}
                    onChange={onSelect}
                />
            )}
        </View>
    );
}
