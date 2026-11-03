import { addHabit } from "@/storage/habits";
import { colors, globalStyles } from "@/styles/global";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as Haptics from "expo-haptics";

export default function AddHabitScreen() {
    const [name, setName] = useState("");
    const [frequency, setFrequency] = useState("");
    const [goal, setGoal] = useState("");
    const [streak, setStreak] = useState(0);

    const handleAddHabit = async () => {
        if (!(name && frequency && goal)) {
            Alert.alert("Please fill in all fields.");
            return;
        }
        await addHabit({ name, frequency, goal, streak: 0 });
        setName("");
        setFrequency("");
        setGoal("");
        setStreak(0);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Habit added successfully!");
        router.push("/");
    };

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Add Habit</Text>

            <TextInput
                style={styles.input}
                placeholder="Habit name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Frequency (e.g. Daily)"
                placeholderTextColor={colors.textSecondary}
                value={frequency}
                onChangeText={setFrequency}
            />

            <TextInput
                style={styles.input}
                placeholder="Weekly goal (e.g. 5 times)"
                placeholderTextColor={colors.textSecondary}
                value={goal}
                onChangeText={setGoal}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddHabit}>
                <Text style={styles.buttonText}>Create Habit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: colors.surface,
        color: colors.text,
        padding: 16,
        borderRadius: 10,
        fontSize: 16,
        marginTop: 16,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 24,
    },
    buttonText: {
        color: colors.background,
        fontSize: 16,
        fontWeight: "bold",
    },
});
