import React, { useContext, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { UserContext } from "@/lib/UserContext";

import Button from "@/components/Button";

import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import * as Progress from "react-native-progress";
import Colors from "@/assets/constant/Colors";

export default function ChapterViewPage() {
    const userEmail = useContext(UserContext).user?.email;
    const { chapterParams, docId, chapterIndex } = useLocalSearchParams();
    const router = useRouter();
    const chapter = Array.isArray(chapterParams)
        ? JSON.parse(chapterParams[0])
        : JSON.parse(chapterParams);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);

    function getProggres(currentPage: number): number {
        return currentPage / chapter?.content.length;
    }

    async function handlePageFinish() {
        try {
            setLoading(true);
            await updateDoc(
                doc(db, "courses", userEmail + " " + String(docId)),
                {
                    completedChapters: arrayUnion(chapterIndex),
                }
            );
            router.replace(`/course-view/${docId}`);
        } catch (error) {
            console.error("Error updating completed chapters:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Progress.Bar
                progress={getProggres(currentPage)}
                width={Dimensions.get("screen").width * 0.85}
            />
            <View style={styles.innerContainer}>
                <Text style={styles.chapterTitle}>
                    {chapter.content[currentPage]?.topic}
                </Text>
                <Text style={styles.chapterContent}>
                    {chapter.content[currentPage]?.explain}
                </Text>
                {chapter.content[currentPage]?.code && (
                    <Text
                        style={[
                            styles.exampleText,
                            {
                                backgroundColor: Colors.BLACK,
                                color: Colors.GREEN,
                            },
                        ]}
                    >
                        {chapter.content[currentPage]?.code}
                    </Text>
                )}
                {chapter.content[currentPage]?.example && (
                    <Text style={styles.exampleText}>
                        {chapter.content[currentPage]?.example}
                    </Text>
                )}
            </View>
            <View style={styles.buttonContainer}>
                {chapter?.content?.length - 1 !== currentPage ? (
                    <Button
                        text="Next"
                        type="fill"
                        onPress={() => setCurrentPage(currentPage + 1)}
                        loading={loading}
                    />
                ) : (
                    <Button
                        text="Finish"
                        type="fill"
                        onPress={handlePageFinish}
                        loading={loading}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        padding: 25,
        backgroundColor: Colors.WHITE,
    },
    innerContainer: {
        marginTop: 20,
    },
    chapterTitle: {
        fontSize: 25,
        fontWeight: "bold",
    },
    chapterContent: {
        fontSize: 20,
        marginTop: 7,
    },
    exampleText: {
        padding: 25,
        backgroundColor: Colors.BG_GRAY,
        borderRadius: 15,
        fontSize: 18,
        marginTop: 15,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 10,
        left: 25,
        width: "100%",
    },
});
