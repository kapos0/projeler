import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import Colors from "@/assets/constant/Colors";

type ButtonProps = {
    text: string;
    type: "fill" | "outline";
    isDanger?: boolean;
    onPress: () => void;
    loading?: boolean;
};

export default function Button({
    text,
    type,
    onPress,
    loading,
    isDanger,
}: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading}
            style={[
                styles.button,
                styles[type],
                isDanger && styles.danger,
                loading && { opacity: 0.7 },
            ]}
        >
            {!loading ? (
                <Text
                    style={[
                        styles.buttonText,
                        {
                            color:
                                type === "fill" ? Colors.WHITE : Colors.PRIMARY,
                        },
                        isDanger && { color: Colors.WHITE },
                    ]}
                >
                    {text}
                </Text>
            ) : (
                <ActivityIndicator
                    size="small"
                    color={type === "fill" ? Colors.WHITE : Colors.PRIMARY}
                />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        width: "100%",
        borderRadius: 15,
        marginTop: 15,
    },
    fill: {
        backgroundColor: Colors.PRIMARY,
    },
    outline: {
        borderColor: Colors.PRIMARY,
        backgroundColor: Colors.WHITE,
        borderWidth: 1,
    },
    danger: {
        backgroundColor: Colors.RED,
        borderColor: Colors.WHITE,
    },
    buttonText: {
        textAlign: "center",
        fontSize: 18,
    },
});
