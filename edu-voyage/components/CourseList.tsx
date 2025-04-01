import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { imageAssets } from "@/assets/constant/Option";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/assets/constant/Colors";
import { useRouter } from "expo-router";

export default function CourseList({
    courses,
    title,
    enroll = false,
}: {
    courses: Record<string, unknown>[];
    title?: string;
    enroll?: boolean;
}) {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.headingText}>
                {title ? title : "Your Courses"}
            </Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={courses}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.courseContainer}
                        onPress={() =>
                            router.push({
                                pathname: `/course-view/[courseId]`,
                                params: {
                                    courseId: item?.docId as string,
                                    courseParam: JSON.stringify(item),
                                    enrollParam: JSON.stringify(enroll),
                                },
                            })
                        }
                    >
                        <Image
                            source={
                                imageAssets[
                                    item?.banner_image as keyof typeof imageAssets
                                ]
                            }
                            style={styles.courseImage}
                        />
                        <Text style={styles.courseTitle}>
                            {item?.courseTitle as string}
                        </Text>
                        <View style={styles.courseChapters}>
                            <Ionicons
                                name="book-outline"
                                size={20}
                                color="black"
                            />
                            <Text>
                                {(item?.chapters as { length: number })?.length}{" "}
                                Chapters
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    headingText: {
        fontSize: 25,
        fontWeight: "bold",
    },
    courseContainer: {
        padding: 10,
        backgroundColor: Colors.BG_GRAY,
        margin: 6,
        borderRadius: 15,
        width: 260,
    },
    courseImage: {
        width: "100%",
        height: 150,
        borderRadius: 15,
    },
    courseTitle: {
        fontWeight: "bold",
        fontSize: 18,
        marginTop: 10,
    },
    courseChapters: {
        flex: 1,
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        marginTop: 5,
    },
});
