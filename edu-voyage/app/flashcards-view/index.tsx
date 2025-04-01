import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    Text,
    View,
    SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import FlipCard from "react-native-flip-card";
import * as Progress from "react-native-progress";

import Colors from "@/assets/constant/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "@/components/Button";

export default function FlashCardsPage() {
    const router = useRouter();
    const { courseParam } = useLocalSearchParams();
    const course = Array.isArray(courseParam)
        ? JSON.parse(courseParam[0])
        : JSON.parse(courseParam);
    const flashCards = course?.flashcards;
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const screenWidth = Dimensions.get("screen").width;

    function getProgress(currentCard: number) {
        return (currentCard + 1) / flashCards?.length;
    }

    function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
        const offset = event?.nativeEvent?.contentOffset.x;
        const cardWidth = screenWidth * 0.9;
        const index = Math.round(offset / cardWidth);
        setCurrentCardIndex(index);
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
                    {currentCardIndex + 1} of {flashCards?.length}
                </Text>
            </View>
            <View style={styles.progressBar}>
                <Progress.Bar
                    progress={getProgress(currentCardIndex)}
                    width={Dimensions.get("window").width * 0.85}
                    height={8}
                    color={Colors.WHITE}
                />
            </View>
            <View style={styles.cardContainer}>
                <FlatList
                    data={flashCards}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.flashCardView}>
                                <FlipCard style={styles.flipCard}>
                                    {/* Face Side */}
                                    <View style={styles.cardFace}>
                                        <Text style={styles.frontText}>
                                            {item?.front}
                                        </Text>
                                    </View>
                                    {/* Back Side */}
                                    <View style={styles.cardBack}>
                                        <Text style={styles.backText}>
                                            {item?.back}
                                        </Text>
                                    </View>
                                </FlipCard>
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
        width: "100%",
        alignSelf: "center",
        backgroundColor: Colors.PRIMARY,
        borderRadius: 20,
        elevation: 1,
    },
    flashCardView: {
        height: 500,
        width: Dimensions.get("screen").width * 0.9,
    },
    flipCard: {
        height: 400,
        backgroundColor: Colors.WHITE,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginHorizontal: Dimensions.get("screen").width * 0.05,
    },
    cardFace: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
    },
    cardBack: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.PRIMARY,
        borderRadius: 20,
    },
    frontText: {
        fontWeight: "bold",
        fontSize: 28,
    },
    backText: {
        color: Colors.WHITE,
        fontSize: 28,
        width: Dimensions.get("screen").width * 0.8,
        fontWeight: "bold",
        padding: 20,
        textAlign: "center",
    },
    backButton: {
        padding: 8,
        backgroundColor: Colors.WHITE,
        borderRadius: 50,
    },
});
