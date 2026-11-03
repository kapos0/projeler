import HabitGrid from "@/components/HabitGrid";
import HomeHeader from "@/components/HomeHeader";
import RecentHabits from "@/components/RecentHabits";
import ShareButton from "@/components/ShareButton";
import { getHabits, Habit } from "@/storage/habits";
import { globalStyles } from "@/styles/global";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { Text, View } from "react-native";
import ReminderToggle from "@/components/ReminderToggle";

export default function HomeScreen() {
    const [habits, setHabits] = useState<Habit[]>([]);
    async function loadHabits() {
        const storedHabits = await getHabits();
        setHabits(storedHabits);
    }
    useFocusEffect(
        useCallback(() => {
            loadHabits();
        }, []),
    );
    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.header}>
                <Text style={globalStyles.title}>MacroZone</Text>
                <ShareButton habits={habits} />
            </View>
            <HomeHeader />
            <HabitGrid habits={habits} />
            <CopyButton habits={habits} />
            <ReminderToggle />
            <RecentHabits habits={habits} onDelete={loadHabits} />
        </View>
    );
}
