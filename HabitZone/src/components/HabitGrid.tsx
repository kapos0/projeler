import { Habit } from "@/storage/habits";
import { StyleSheet, View } from "react-native";
import HabitCard from "./HabitCard";

type HabitGridProps = {
    habits: Habit[];
};

export default function HabitGrid({ habits }: HabitGridProps) {
    const totals = habits.reduce(
        (acc, habit) => {
            acc.total += habit.streak;
            const goal = Number(habit.goal);
            if (!Number.isNaN(goal)) acc.goal = Number(acc.goal) + goal;
            else acc.goal = habit.goal;
            return acc;
        },
        { total: 0, goal: 0 as number | string },
    );
    return (
        <View style={styles.grid}>
            <HabitCard
                label="Morning walk"
                value={4}
                goal="day streak"
                color="#ff6b6b"
            />
            <HabitCard
                label="Read a book"
                value={7}
                goal="day streak"
                color="#4ecdc4"
            />
            <HabitCard
                label="Practice Spanish"
                value={2}
                goal="day streak"
                color="#ffd93d"
            />
            <HabitCard
                label="Drink water"
                value={5}
                goal="day streak"
                color="#6bcb77"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
});
