import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

import { db } from "@/lib/firebase";
import {
    collection,
    DocumentSnapshot,
    getDocs,
    query,
    where,
} from "firebase/firestore";

import CourseList from "./CourseList";

export default function ExploreCourseList({ category }: { category: string }) {
    const [courseList, setCourseList] = useState<Record<string, unknown>[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCourseListByCategory = useCallback(async () => {
        setLoading(true);
        try {
            const newCourses: Record<string, unknown>[] = [];
            const coursesQuery = query(
                collection(db, "courses"),
                where("category", "==", category)
            );
            const querySnapShot = await getDocs(coursesQuery);
            querySnapShot.forEach((course: DocumentSnapshot) => {
                const courseData = course.data();
                if (courseData) newCourses.push(courseData);
            });
            setCourseList(newCourses);
        } catch (error) {
            console.error("Error fetching course list:", error);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        fetchCourseListByCategory();
    }, [fetchCourseListByCategory]);

    return (
        <View>
            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={
                    <View>
                        {loading ? (
                            <ActivityIndicator />
                        ) : (
                            courseList.length > 0 && (
                                <CourseList
                                    courses={courseList}
                                    title={category}
                                    enroll={true}
                                />
                            )
                        )}
                    </View>
                }
            />
        </View>
    );
}
