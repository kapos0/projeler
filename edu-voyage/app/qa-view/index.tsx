import React, { useState } from "react";
import {
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Button from "@/components/Button";

import Colors from "@/assets/constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function QuestionAnswerPage() {
    const router = useRouter();
    const { courseParam } = useLocalSearchParams();
    const course = Array.isArray(courseParam)
        ? JSON.parse(courseParam[0])
        : JSON.parse(courseParam);
    const qaList = course.qa;
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(
        null
    );

    function handleQuestionSelect(index: number) {
        setSelectedQuestion((prev) => (prev === index ? null : index));
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[]}
                renderItem={() => null}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View>
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
                            <Text style={styles.headingText}>
                                Question Answer Page
                            </Text>
                        </View>

                        <Text style={styles.courseTitleText}>
                            {course?.courseTitle}
                        </Text>
                        <FlatList
                            data={qaList}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <View>
                                        <Pressable
                                            style={styles.qaContainerButton}
                                            onPress={() =>
                                                handleQuestionSelect(index)
                                            }
                                        >
                                            <Text style={styles.questionText}>
                                                {item.question}
                                            </Text>
                                            {selectedQuestion === index && (
                                                <View
                                                    style={
                                                        styles.answerContainer
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.answerText
                                                        }
                                                    >
                                                        {item.answer}
                                                    </Text>
                                                </View>
                                            )}
                                        </Pressable>
                                    </View>
                                );
                            }}
                        />
                        <Button
                            text="Finish"
                            type="outline"
                            onPress={() => router.push("/(tabs)/home")}
                        />
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.PRIMARY,
    },
    headingText: {
        fontSize: 25,
        fontWeight: "bold",
        color: Colors.WHITE,
    },
    courseTitleText: {
        fontSize: 20,
        color: Colors.WHITE,
        marginBottom: 10,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
    },
    qaContainerButton: {
        padding: 20,
        marginTop: 15,
        elevation: 1,
        backgroundColor: Colors.WHITE,
        borderRadius: 12,
    },
    questionText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.BLACK,
    },
    answerContainer: {
        borderTopWidth: 1,
        marginTop: 10,
    },
    answerText: {
        fontSize: 17,
        color: Colors.GREEN,
        marginTop: 10,
    },
    backButton: {
        padding: 8,
        backgroundColor: Colors.WHITE,
        borderRadius: 50,
    },
});
