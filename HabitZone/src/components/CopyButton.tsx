import { Habit } from "@/storage/habits";
import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

type CopyButtonProps = {
    habits: Habit[];
};

export default function CopyButton({ habits }: CopyButtonProps) {
    const handleCopy = async () => {
        const summary =
            habits.length === 0
                ? "HabitZone\n\nNo habits added yet."
                : `HabitZone\n\n${habits
                      .map(
                          (habit) =>
                              `${habit.name} - ${habit.streak} day streak (${habit.frequency})\nGoal: ${habit.goal}`,
                      )
                      .join("\n\n")}`;

        await Clipboard.setStringAsync(summary);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert("Copied!", "Habits summary copied to clipboard.");
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={18} color={colors.primary} />
            <Text style={styles.text}>Copy Summary</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 16,
    },
    text: {
        color: colors.primary,
        fontSize: 14,
    },
});
