import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, FlatList } from "react-native";

import Header from "@/components/Header";
import NoContent from "@/components/NoContent";

import { UserContext } from "@/lib/UserContext";

import { db } from "@/lib/firebase";
import {
    collection,
    DocumentSnapshot,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import CourseList from "@/components/CourseList";
import Practices from "@/components/Practices";
import CourseProgress from "@/components/CourseProgress";

import Colors from "@/assets/constant/Colors";

export default function HomePage() {
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
        <SafeAreaView style={styles.container}>
            <Header />
            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={
                    courses?.length === 0 ? (
                        <NoContent />
                    ) : (
                        <View>
                            <CourseProgress courses={courses} />
                            <Practices />
                            <CourseList courses={courses} />
                        </View>
                    )
                }
                onRefresh={getCourses}
                refreshing={refreshing}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 25,
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
});
