import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
    text: string;
    numberOfLines?: number; // default = 2
    style?: React.CSSProperties | any;
}

export default function CollapsibleText({ text, numberOfLines = 2 }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);

    return (
        <View>
            <Text
                numberOfLines={expanded ? 0 : numberOfLines}
                onTextLayout={(e) => {
                    // Detect if text takes more than numberOfLines
                    if (e.nativeEvent.lines.length > numberOfLines && !textShown) {
                        setTextShown(true);
                        setLengthMore(true);
                    }
                }}
                style={{ color: "#333" }}
            >
                {text}
            </Text>

            {lengthMore ? (
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text style={{ color: "#007AFF", marginTop: 4 }}>
                        {expanded ? "Read less" : "Read more"}
                    </Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
}
