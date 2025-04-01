import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { UserContext } from "@/lib/UserContext";

import {
    doc,
    setDoc,
    query,
    where,
    collection,
    getDocs,
    deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

import Button from "./Button";

import { imageAssets } from "@/assets/constant/Option";
import Colors from "@/assets/constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function CourseIntro({
    course,
    enroll,
}: {
    course?: Record<string, unknown>;
    enroll?: boolean;
}) {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const [isRegistered, setIsRegistered] = useState(false);

    const checkIfRegistered = useCallback(async () => {
        if (!user || !course?.docId) return; // Ensure course.docId is defined
        setLoading(true);
        try {
            const coursesRef = collection(db, "courses");
            const q = query(
                coursesRef,
                where("docId", "==", course.docId),
                where("createdBy", "==", user.email)
            );
            const querySnapshot = await getDocs(q);
            setIsRegistered(querySnapshot.empty ? false : true);
        } catch (error) {
            console.error("Error checking registration:", error);
        } finally {
            setLoading(false);
        }
    }, [user, course]);

    useEffect(() => {
        async function check() {
            await checkIfRegistered();
        }
        check();
    }, [user, checkIfRegistered]);

    if (!course) return null;

    async function handleRegister() {
        setLoading(true);
        try {
            const timeStamp = Date.now().toString();
            const docId = user?.email + " " + timeStamp;
            const data = {
                ...Object.fromEntries(
                    Object.entries(course || {}).filter(
                        ([key]) =>
                            key !== "docId" &&
                            key !== "completedChapters" &&
                            key !== "quizResults"
                    )
                ),
                docId: timeStamp,
                createdBy: user?.email,
                createdAt: timeStamp,
                enrolled: true,
            };
            await setDoc(doc(db, "courses", docId), data);
            router.push({
                pathname: `/course-view/[courseId]`,
                params: {
                    courseId: docId,
                    courseParam: JSON.stringify(data),
                    enrollParam: JSON.stringify(enroll),
                },
            });
        } catch (error) {
            console.error("Error registering course:", error);
        } finally {
            setLoading(false);
        }
    }

    async function enrollCourse() {
        setLoading(true);
        try {
            const coursesRef = collection(db, "courses");
            const q = query(
                coursesRef,
                where("createdBy", "==", user?.email),
                where("courseTitle", "==", course?.courseTitle)
            );
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                alert("You are already enrolled in this course.");
                return;
            }
            await handleRegister();
        } catch (error) {
            console.error("Error enrolling in course:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUnRegister() {
        setLoading(true);
        try {
            const docRef = user?.email + " " + course?.docId;
            await deleteDoc(doc(db, "courses", docRef));
            setIsRegistered(false);
            router.push("/(tabs)/home");
        } catch (error) {
            console.error("Error unregistering course:", error);
            alert("Failed to unregister. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <Image
                source={
                    imageAssets[
                        course?.banner_image as keyof typeof imageAssets
                    ]
                }
                style={styles.image}
            />
            <View style={styles.innerContainer}>
                <Text style={styles.courseTitleText}>
                    {course?.courseTitle as string}
                </Text>
                <View style={styles.courseChapters}>
                    <Ionicons
                        name="book-outline"
                        size={20}
                        color={Colors.PRIMARY}
                    />
                    <Text style={{ color: Colors.PRIMARY }}>
                        {(course?.chapters as { length: number })?.length}{" "}
                        Chapters
                    </Text>
                </View>
                <Text style={styles.courseDescHeadingText}>Description: </Text>
                <Text style={styles.courseDescText}>
                    {course?.description as string}
                </Text>
                {enroll && !isRegistered ? (
                    <Button
                        text="Enroll Now"
                        type="fill"
                        loading={loading}
                        onPress={enrollCourse}
                    />
                ) : (
                    <View>
                        {isRegistered ? (
                            <Button
                                text="Delete"
                                type="outline"
                                isDanger
                                onPress={() =>
                                    Alert.alert(
                                        "Log out",
                                        "Are you sure you want to log out?",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            {
                                                text: "OK",
                                                onPress: handleUnRegister,
                                            },
                                        ]
                                    )
                                }
                            />
                        ) : (
                            <Button
                                text="Start Now"
                                type="fill"
                                onPress={handleRegister}
                            />
                        )}
                    </View>
                )}
            </View>
            <Pressable
                style={styles.backButton}
                onPress={() => router.push("/(tabs)/home")}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 280,
    },
    innerContainer: {
        padding: 20,
    },
    courseTitleText: {
        fontWeight: "bold",
        fontSize: 25,
    },
    courseChapters: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
        marginVertical: 5,
    },
    courseDescHeadingText: {
        fontWeight: "bold",
        fontSize: 18,
    },
    courseDescText: {
        fontSize: 18,
        color: Colors.GRAY,
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: Colors.WHITE,
        padding: 10,
        borderRadius: 50,
    },
});
