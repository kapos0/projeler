import { deleteHabit } from "@/storage/habits";
import * as Haptics from "expo-haptics";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

type HabitItemProps = {
    id: string;
    name: string;
    frequency: string;
    streak: number;
    goal: string;
    onDelete: () => void;
};

export default function HabitItem({
    id,
    name,
    frequency,
    streak,
    goal,
    onDelete,
}: HabitItemProps) {
    function handleLongPress() {
        Alert.alert(
            "Delete Habit",
            `Are you sure you want to delete "${name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        Haptics.notificationAsync(
                            Haptics.NotificationFeedbackType.Success,
                        );
                        await deleteHabit(id);
                        onDelete();
                    },
                },
            ],
        );
    }
    return (
        <TouchableOpacity
            style={styles.container}
            onLongPress={handleLongPress}
        >
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.details}>
                {frequency} • {goal} • {streak} day streak
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#16213e",
        borderRadius: 10,
        padding: 16,
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
        color: "#ffffff",
    },
    details: {
        fontSize: 13,
        color: "#a0a0b0",
        marginTop: 4,
    },
});
