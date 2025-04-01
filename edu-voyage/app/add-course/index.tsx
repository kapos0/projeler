import React, { useContext, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { UserContext } from "@/lib/UserContext";

import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { GenerateCourseAI, GenerateTopicsAI } from "@/lib/AiAgent";
import Prompt from "@/assets/constant/Prompt";

import Colors from "@/assets/constant/Colors";
import Button from "@/components/Button";
import { router } from "expo-router";

export default function AddCoursePage() {
    const [resultText, setResultText] = useState("What are you curious about?");
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [topics, setTopics] = useState<string[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

    async function generateTopic() {
        if (userInput.trim() === "") return;
        setLoading(true);
        try {
            const PROMPT = userInput + Prompt.IDEA;
            const aiResponse = await GenerateTopicsAI.sendMessage(PROMPT);
            const data = aiResponse.response.text();
            setTopics(JSON.parse(data));
            setUserInput("");
            setResultText("Select all topics which you are interested in");
        } catch (error) {
            console.error("Error generating topics:", error);
        } finally {
            setLoading(false);
        }
    }

    async function generateCourse() {
        if (selectedTopics.length === 0) return;
        setLoading(true);
        try {
            const PROMPT = selectedTopics + Prompt.COURSE;
            const aiResponse = await GenerateCourseAI.sendMessage(PROMPT);
            const data = aiResponse.response.text();
            const courses = JSON.parse(data);
            const docId = Date.now().toString();
            courses.forEach(async (course: Record<string, unknown>) => {
                try {
                    await setDoc(
                        doc(db, "courses", user?.email + " " + docId),
                        {
                            ...course,
                            topics: selectedTopics,
                            createdBy: user?.email,
                            createdAt: Date.now(),
                            docId: docId,
                        }
                    );
                } catch (error) {
                    console.error("Error saving course:", error);
                }
            });
            setResultText("Courses Created Successfully!");
            Alert.alert("Courses Created Successfully!", "", [
                {
                    text: "OK",
                    onPress: () => router.push("/(tabs)/home"),
                },
            ]);
        } catch (error) {
            console.error("Error generating courses:", error);
        } finally {
            setLoading(false);
        }
    }

    function handleSelection(topic: string) {
        setSelectedTopics((prev) => {
            if (prev.includes(topic))
                return prev.filter((item) => item !== topic);
            return [...prev, topic];
        });
    }

    function isSelected(topic: string) {
        const selection = selectedTopics.includes(topic);
        return selection ? true : false;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ListHeaderComponent={
                    <>
                        <Text style={styles.heading}>Create a New Course</Text>
                        <Text style={styles.subHeading}>
                            What you want to learn today?
                        </Text>
                        <Text style={styles.containerText}>
                            What course you want to create (ex.Learn Python,
                            Digital Marketting, 10Th Science Chapters, etc...)
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Learn Anything you want"
                            numberOfLines={5}
                            multiline
                            value={userInput}
                            onChangeText={(value) => setUserInput(value)}
                        />
                        <Button
                            text="Generate Topic"
                            type="outline"
                            onPress={generateTopic}
                            loading={loading}
                        />
                        <View style={styles.coursesContainer}>
                            <Text style={styles.coursesContainerText}>
                                {!loading ? resultText : "Loading..."}
                            </Text>
                        </View>
                    </>
                }
                data={topics}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable onPress={() => handleSelection(item)}>
                        <Text
                            style={[
                                styles.courseText,
                                {
                                    backgroundColor: isSelected(item)
                                        ? Colors.PRIMARY
                                        : Colors.WHITE,
                                    color: isSelected(item)
                                        ? Colors.WHITE
                                        : Colors.BLACK,
                                },
                            ]}
                        >
                            {item}
                        </Text>
                    </Pressable>
                )}
                ListFooterComponent={
                    <View>
                        {selectedTopics.length > 0 && (
                            <Button
                                text="Create Course"
                                type="fill"
                                loading={loading}
                                onPress={generateCourse}
                            />
                        )}
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        flex: 1,
        padding: 25,
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
    },
    subHeading: {
        fontSize: 30,
    },
    containerText: {
        fontSize: 20,
        marginTop: 8,
        color: Colors.GRAY,
    },
    input: {
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        height: 100,
        marginTop: 10,
        alignItems: "flex-start",
        fontSize: 18,
    },
    coursesContainer: {
        marginVertical: 15,
    },
    coursesContainerText: {
        fontSize: 20,
    },
    coursesList: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 6,
    },
    courseText: {
        padding: 7,
        margin: 7,
        borderWidth: 0.5,
        borderRadius: 99,
        paddingHorizontal: 15,
    },
});
