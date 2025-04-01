import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import CourseProgressCard from "./CourseProgressCard";

export default function CourseProgress({
    courses,
}: {
    courses: Record<string, unknown>[];
}) {
    return (
        <View style={styles.container}>
            <Text style={styles.headingText}>Progress</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={courses}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        <CourseProgressCard item={item} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    headingText: {
        fontSize: 25,
        fontWeight: "bold",
    },
});
