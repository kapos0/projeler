import HabitItem from "@/components/HabitItem";
import { clearAllHabits, getHabits, Habit } from "@/storage/habits";
import { globalStyles } from "@/styles/global";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HabitsScreen() {
    const [habits, setHabits] = useState<Habit[]>([]);

    const loadHabits = async () => {
        const data = await getHabits();
        setHabits(data);
    };

    const handleClearAll = async () => {
        await clearAllHabits();
        loadHabits();
    };

    useFocusEffect(
        useCallback(() => {
            loadHabits();
        }, []),
    );

    return (
        <ScrollView style={globalStyles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.title}>All Habits</Text>
                <TouchableOpacity onPress={handleClearAll}>
                    <Text style={styles.clearButton}>Clear All</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 30 }}>
                {habits.length === 0 ? (
                    <Text style={globalStyles.empty}>
                        No habits logged yet.
                    </Text>
                ) : (
                    habits.map((habit) => (
                        <HabitItem
                            key={habit.id}
                            id={habit.id}
                            name={habit.name}
                            frequency={habit.frequency}
                            streak={habit.streak}
                            goal={habit.goal}
                            onDelete={loadHabits}
                        />
                    ))
                )}
            </View>
        </ScrollView>
    );
}

const styles = {
    clearButton: {
        color: "red",
        fontSize: 16,
    },
};
