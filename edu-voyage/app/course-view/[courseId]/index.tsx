import React, { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { UserContext } from "@/lib/UserContext";

import { doc, DocumentData, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import CourseIntro from "@/components/CourseIntro";
import CourseChapters from "@/components/CourseChapters";

import Colors from "@/assets/constant/Colors";

export default function CourseViewPage() {
    const userEmail = useContext(UserContext).user?.email;
    const { courseParam, courseId, enrollParam } = useLocalSearchParams();
    const [course, setCourse] = useState<DocumentData>();
    const getCourseById = useCallback(async () => {
        try {
            const docRef = await getDoc(
                doc(db, "courses", userEmail + " " + String(courseId))
            );
            setCourse(docRef.data());
        } catch (error) {
            console.error("Error fetching course by ID:", error);
        }
    }, [courseId, userEmail]);
    let enroll = false;
    if (enrollParam === "true") enroll = true;
    useEffect(() => {
        if (!courseParam) getCourseById();
        else
            setCourse(
                Array.isArray(courseParam)
                    ? JSON.parse(courseParam[0])
                    : JSON.parse(courseParam)
            );
    }, [courseId, getCourseById, courseParam, enroll]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={
                    <View>
                        <CourseIntro course={course} enroll={enroll} />
                        <CourseChapters
                            courseChapters={course?.chapters}
                            completedChapters={course?.completedChapters}
                            docId={course?.docId}
                        />
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
});
