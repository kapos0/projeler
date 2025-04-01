import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import Button from "./Button";
import bookImage from "@/assets/images/book.png";

export default function NoContent() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Image source={bookImage} style={styles.image} />
            <Text style={styles.containerText}>There is no content</Text>
            <Button
                text="+ Create New Content"
                type="fill"
                onPress={() => router.push("/add-course")}
            />
            <Button
                text="Explore existing content"
                type="outline"
                onPress={() => {}}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        display: "flex",
        alignItems: "center",
    },
    image: {
        height: 200,
        width: 200,
    },
    containerText: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },
});
