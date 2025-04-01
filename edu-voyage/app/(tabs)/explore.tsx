import React from "react";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";

import ExploreCourseList from "@/components/ExploreCourseList";

import { CourseCategory } from "@/assets/constant/Option";
import Colors from "@/assets/constant/Colors";

export default function ExplorePage() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Explore More Courses</Text>
            {Platform.OS === "web" && (
                <Text style={styles.subheading}>
                    The explore page may not work properly on the web platform.
                </Text>
            )}
            {CourseCategory.map((item, index) => (
                <View key={index} style={styles.catContainer}>
                    <ExploreCourseList category={item} />
                </View>
            ))}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        backgroundColor: Colors.WHITE,
        height: "100%",
        flex: 1,
    },
    heading: {
        fontWeight: "bold",
        fontSize: 30,
    },
    subheading: {
        fontSize: 15,
    },
    catContainer: {
        marginTop: 10,
    },
    catTitle: {
        fontWeight: "bold",
        fontSize: 20,
    },
});
