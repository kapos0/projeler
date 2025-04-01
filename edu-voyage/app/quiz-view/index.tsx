import React, { useContext, useState } from "react";
import {
    Dimensions,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { UserContext } from "@/lib/UserContext";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import Button from "@/components/Button";
import * as Progress from "react-native-progress";

import Colors from "@/assets/constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function QuicPage() {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const { courseParam } = useLocalSearchParams();
    const course = Array.isArray(courseParam)
        ? JSON.parse(courseParam[0])
        : JSON.parse(courseParam);
    const [currentPage, setCurrentPage] = useState(0);
    const currentQuiz = course.quiz[currentPage];
    const [selectedOption, setSelectedOption] = useState("");
    const [result, setResult] = useState<
        { selectedChoice: string; isCorrect: boolean; question: string }[]
    >([]);
    const [loading, setLoading] = useState(false);
    function getProgress(currentPage: number) {
        return (currentPage + 1) / course?.quiz?.length;
    }
    function handleOptionSelect(selectedChoice: string) {
        setResult((prevResult) => {
            const updatedResult = {
                ...prevResult,
                [currentPage]: {
                    selectedChoice,
                    isCorrect: selectedChoice === currentQuiz?.correctAns,
                    question: currentQuiz?.question,
                    correctAns: currentQuiz?.correctAns,
                },
            };
            return updatedResult;
        });
    }
    async function handleQuizSubmit() {
        setLoading(true);
        try {
            const documentRef = user?.email + " " + course?.docId;
            await updateDoc(doc(db, "courses", documentRef), {
                quizResult: result,
            });
            router.replace({
                pathname: "/quiz-result-view",
                params: {
                    resultParam: JSON.stringify(result),
                },
            });
        } catch (error) {
            console.error("Error submitting quiz:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                </Pressable>
                <Text style={styles.progressText}>
                    {currentPage + 1} of {course?.quiz.length}
                </Text>
            </View>
            <View style={styles.progressBar}>
                <Progress.Bar
                    progress={getProgress(currentPage)}
                    width={Dimensions.get("window").width * 0.85}
                    height={8}
                    color={Colors.WHITE}
                />
            </View>
            <View style={styles.cardContainer}>
                <Text style={styles.questionText}>{currentQuiz.question}</Text>
                {currentQuiz?.options.map((option: string, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.optionsContainer,
                            {
                                borderColor:
                                    selectedOption === option
                                        ? Colors.GREEN
                                        : Colors.GRAY,
                                backgroundColor:
                                    selectedOption === option
                                        ? Colors.LIGHT_GREEN
                                        : Colors.WHITE,
                            },
                        ]}
                        onPress={() => {
                            setSelectedOption(option);
                            handleOptionSelect(option);
                        }}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
                {selectedOption && (
                    <View>
                        {currentPage === course?.quiz.length - 1 ? (
                            <Button
                                text="Finish"
                                type="fill"
                                onPress={handleQuizSubmit}
                                loading={loading}
                            />
                        ) : (
                            <Button
                                text="Next"
                                type="fill"
                                onPress={() => {
                                    setCurrentPage((prev) => prev + 1);
                                    setSelectedOption("");
                                }}
                                loading={loading}
                            />
                        )}
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.PRIMARY,
        height: "100%",
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    progressText: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.WHITE,
    },
    progressBar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 15,
    },
    cardContainer: {
        padding: 20,
        width: "92%",
        alignSelf: "center",
        backgroundColor: Colors.WHITE,
        borderRadius: 20,
        elevation: 1,
    },
    questionText: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
    },
    optionsContainer: {
        padding: 20,
        marginTop: 8,
        borderWidth: 1,
        borderRadius: 10,
    },
    optionText: {
        fontSize: 20,
    },
    backButton: {
        padding: 8,
        backgroundColor: Colors.WHITE,
        borderRadius: 50,
    },
});
