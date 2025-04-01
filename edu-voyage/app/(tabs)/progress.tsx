import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";

import { UserContext } from "@/lib/UserContext";

import { db } from "@/lib/firebase";
import {
    collection,
    DocumentSnapshot,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import CourseProgressCard from "@/components/CourseProgressCard";

import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/assets/constant/Colors";

export default function ProgressPage() {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const getCourses = useCallback(async () => {
        setRefreshing(true);
        const coursesQuery = query(
            collection(db, "courses"),
            where("createdBy", "==", user?.email)
        );
        const coursesSnapshot = await getDocs(coursesQuery);
        const newCourses: Record<string, unknown>[] = [];
        coursesSnapshot.forEach((course: DocumentSnapshot) => {
            const courseData = course.data();
            if (courseData) newCourses.push(courseData);
        });
        setCourses(newCourses);
        setRefreshing(false);
    }, [user]);

    useEffect(() => {
        user && getCourses();
    }, [user, getCourses]);
    return (
        <FlatList
            data={[]}
            renderItem={() => null}
            refreshing={refreshing}
            onRefresh={getCourses}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <Pressable
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                name="arrow-back"
                                size={24}
                                color="black"
                            />
                        </Pressable>
                        <Text style={styles.headerText}>Course Progress</Text>
                    </View>

                    <FlatList
                        data={courses}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: `/course-view/[courseId]`,
                                        params: {
                                            courseId: item?.docId as string,
                                            courseParam: JSON.stringify(item),
                                        },
                                    })
                                }
                            >
                                <CourseProgressCard item={item} />
                            </TouchableOpacity>
                        )}
                    />
                </SafeAreaView>
            }
            ListFooterComponent={
                <Text style={styles.footerText}>End of the list</Text>
            }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.PRIMARY,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        gap: 25,
        alignItems: "center",
        marginBottom: 12,
    },
    headerText: {
        fontSize: 30,
        fontWeight: "bold",
        color: Colors.WHITE,
    },
    footerText: {
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        margin: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: Colors.WHITE,
        borderRadius: 50,
    },
});
