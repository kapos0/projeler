import React, { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { UserContext } from "@/lib/UserContext";

export default function Header() {
    const { user } = useContext(UserContext);
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.headerText}>Hello, {user?.username}</Text>
                <Text style={styles.subText}>Let's Get Started!</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    headerText: {
        fontSize: 25,
        fontWeight: "semibold",
    },
    subText: {
        fontSize: 15,
        fontWeight: "thin",
    },
});
