import React from "react";
import {
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useRouter } from "expo-router";

import Colors from "@/assets/constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CourseChapters({
    courseChapters,
    completedChapters,
    docId,
}: {
    courseChapters: Record<string, unknown>[];
    completedChapters: number[];
    docId: string;
}) {
    const router = useRouter();
    function isChapterCompleted(chapterIndex: number): boolean {
        const isCompleted = completedChapters?.find(
            (item) => Number(item) === chapterIndex
        );

        return isCompleted ? true : false;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.chaptersText}>CourseChapters</Text>
            <FlatList
                data={courseChapters}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.chapterContainer}>
                        <View style={styles.chapterInnerContainer}>
                            <Text style={styles.chapterText}>{index + 1}.</Text>
                            <Text style={styles.chapterText}>
                                {item.chapterName as string}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/chapter-view",
                                    params: {
                                        chapterParams: JSON.stringify(item),
                                        docId: docId,
                                        chapterIndex: index,
                                    },
                                })
                            }
                        >
                            {isChapterCompleted(index) ? (
                                <Ionicons
                                    name="checkmark-done"
                                    size={24}
                                    color={Colors.GREEN}
                                />
                            ) : (
                                <Ionicons
                                    name="play"
                                    size={24}
                                    color={Colors.PRIMARY}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    chaptersText: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 10,
    },
    chapterContainer: {
        padding: 18,
        borderWidth: 0.5,
        borderRadius: 15,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    chapterInnerContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    chapterText: {
        fontSize: 20,
        fontWeight: "bold",
    },
});
