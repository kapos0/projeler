import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { RelativePathString, useRouter } from "expo-router";

import Colors from "@/assets/constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PracticeCourseList({
    courses,
    option,
}: {
    courses: Record<string, unknown>[];
    option:
        | {
              name: string;
              image: any;
              icon: any;
              path: string;
          }
        | undefined;
}) {
    const router = useRouter();
    async function handlePress(course: Record<string, unknown>) {
        if (!course) return;
        router.push({
            pathname: option?.path as RelativePathString,
            params: {
                courseParam: JSON.stringify(course),
            },
        });
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                numColumns={2}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.innerContainer}
                        onPress={() => handlePress(item)}
                    >
                        {option?.path === "/quiz-view" &&
                            (item?.quizResult ? (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color={Colors.GREEN}
                                    style={styles.checkIcon}
                                />
                            ) : (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color={Colors.GRAY}
                                    style={styles.checkIcon}
                                />
                            ))}
                        <Image source={option?.icon} style={styles.image} />
                        <Text style={styles.courseTitle}>
                            {item?.courseTitle as string}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        margin: 20,
    },
    image: {
        objectFit: "contain",
        width: "100%",
        height: 70,
    },
    innerContainer: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        margin: 5,
        padding: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        elevation: 1,
    },
    courseTitle: {
        marginTop: 7,
        textAlign: "center",
    },
    checkIcon: {
        position: "absolute",
        top: 10,
        right: 20,
    },
});
