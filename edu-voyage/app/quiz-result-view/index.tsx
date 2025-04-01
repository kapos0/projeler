import React, { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import Button from "@/components/Button";

import Colors from "@/assets/constant/Colors";

export default function QuizResultPage() {
    const { resultParam } = useLocalSearchParams();
    const router = useRouter();
    const result: Record<string, unknown>[] = Array.isArray(resultParam)
        ? JSON.parse(resultParam[0])
        : JSON.parse(resultParam);

    const totalQuestionsNum = Object.keys(result).length;
    const [score, setScore] = useState<number | null>(null);

    const calculateScore = useCallback(() => {
        if (!result) return;

        const correctAnswers = Object.entries(result)
            ?.filter(([_, value]) => value?.isCorrect === true)
            .map(([_, value]) => value);

        const score = (correctAnswers.length / totalQuestionsNum) * 100;
        setScore(score);
    }, [result, totalQuestionsNum]);

    useEffect(() => {
        calculateScore();
    }, [calculateScore]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={
                    <View>
                        <Text style={styles.headingText}>Quiz Result</Text>
                        <View style={styles.resultContainer}>
                            <Image
                                source={require("@/assets/images/trophy.png")}
                                style={styles.image}
                            />
                            <Text style={styles.congratulationsText}>
                                {score && score >= 50
                                    ? "Congratulations!"
                                    : "Try Again!"}
                            </Text>
                            <Text style={styles.scoreText}>
                                You scored {score} points out of{" "}
                                {totalQuestionsNum} questions
                            </Text>
                            {score && (
                                <View style={styles.statsContainer}>
                                    <Text>{totalQuestionsNum} 📝</Text>
                                    <Text>{score / 10} ✅</Text>
                                    <Text>
                                        {totalQuestionsNum - score / 10} ❌
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View>
                            <Text style={styles.summaryText}>Summery:</Text>
                            <FlatList
                                data={Object.entries(result)}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View
                                        style={[
                                            styles.questionsContainer,
                                            {
                                                backgroundColor: item[1]
                                                    .isCorrect
                                                    ? Colors.LIGHT_GREEN
                                                    : Colors.LIGHT_RED,
                                            },
                                        ]}
                                    >
                                        <Text>
                                            {item[1]?.question as string}
                                        </Text>
                                        {item[1]?.isCorrect ? null : (
                                            <Text>
                                                Correct is:{" "}
                                                {item[1]?.correctAns as string}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            />
                            <View style={styles.backButtonContainer}>
                                <Button
                                    text="Back Home"
                                    type="fill"
                                    onPress={() =>
                                        router.replace("/(tabs)/home")
                                    }
                                />
                            </View>
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { marginVertical: 10 },
    headingText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 30,
        color: Colors.PRIMARY,
    },
    resultContainer: {
        backgroundColor: Colors.WHITE,
        padding: 15,
        elevation: 7,
        borderRadius: 20,
        marginTop: 30,
        display: "flex",
        alignItems: "center",
        marginHorizontal: 30,
    },
    image: {
        width: 100,
        height: 100,
        marginTop: -50,
    },
    congratulationsText: {
        fontSize: 25,
        fontWeight: "bold",
        color: Colors.BLACK,
    },
    scoreText: {
        fontSize: 17,
        color: Colors.GRAY,
    },
    statsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "50%",
        marginTop: 20,
        marginBottom: 20,
    },
    summaryText: {
        marginHorizontal: 30,
        marginTop: 20,
        fontSize: 25,
        fontWeight: "bold",
        color: Colors.PRIMARY,
    },
    questionsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
        marginHorizontal: 30,
        marginTop: 15,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    backButtonContainer: {
        marginHorizontal: 30,
    },
});
