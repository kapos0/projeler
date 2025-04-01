import React, { useCallback, useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";

import PracticeCourseList from "@/components/PracticeCourseList";

import Colors from "@/assets/constant/Colors";
import { PraticeOption } from "@/assets/constant/Option";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PracticeViewPage() {
    const { type } = useLocalSearchParams();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const option = PraticeOption.find((item) => item.name === type);
    const [courses, setCourses] = useState<Record<string, unknown>[]>([]);

    const getCourseList = useCallback(async () => {
        setLoading(true);
        try {
            setCourses([]);
            const coursesQuery = query(
                collection(db, "courses"),
                where("createdBy", "==", user?.email)
            );
            const querySnapshot = await getDocs(coursesQuery);
            querySnapshot.forEach((doc) => {
                setCourses((prev) => [...prev, doc.data()]);
            });
            setCourses((prev) =>
                prev.sort(
                    (a, b) =>
                        new Date(a.createdAt as string).getTime() -
                        new Date(b.createdAt as string).getTime()
                )
            );
        } catch (error) {
            console.error("Error fetching course list:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        user && getCourseList();
    }, [user, getCourseList]);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={option?.image} style={styles.image} />
            <View style={styles.innerContainer}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="black"
                        style={styles.backIcon}
                    />
                </Pressable>
                <Text style={styles.typeText}>{type}</Text>
            </View>
            {loading && (
                <ActivityIndicator
                    size="large"
                    color={Colors.PRIMARY}
                    style={styles.loadingIcon}
                />
            )}
            <PracticeCourseList courses={courses} option={option} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {},
    image: {
        height: 240,
        width: "100%",
    },
    innerContainer: {
        position: "absolute",
        padding: 10,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    typeText: {
        fontWeight: "bold",
        fontSize: 35,
        color: Colors.WHITE,
    },
    backIcon: {
        backgroundColor: Colors.WHITE,
        padding: 8,
        borderRadius: 50,
    },
    loadingIcon: {
        marginTop: 150,
    },
});
