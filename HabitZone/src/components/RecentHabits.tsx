import HabitItem from "@/components/HabitItem";
import { Habit } from "@/storage/habits";
import { globalStyles } from "@/styles/global";
import { Text, View } from "react-native";

type recentHabitsProps = {
    habits: Habit[];
    onDelete: () => void;
};

export default function ReacentHabits({ habits, onDelete }: recentHabitsProps) {
    return (
        <View style={{ marginTop: 30 }}>
            <Text style={globalStyles.sectionTitle}>Recent Habits</Text>
            {habits.length === 0 ? (
                <Text style={globalStyles.empty}>No habits logged yet.</Text>
            ) : (
                habits
                    .slice(0, 5)
                    .map((habit) => (
                        <HabitItem
                            id={habit.id}
                            key={habit.id}
                            name={habit.name}
                            frequency={habit.frequency}
                            streak={habit.streak}
                            goal={habit.goal}
                            onDelete={onDelete ?? (() => {})}
                        />
                    ))
            )}
        </View>
    );
}
