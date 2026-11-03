import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { colors } from "@/styles/global";
import {
    cancelHabitReminders,
    requestPermissions,
    scheduleHabitReminders,
} from "@/utils/notifications";

const REMINDERS_KEY = "remindersEnabled";

export default function ReminderToggle() {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const load = async () => {
            const val = await AsyncStorage.getItem(REMINDERS_KEY);
            setEnabled(val === "true");
        };
        load();
    }, []);

    const toggle = async (value: boolean) => {
        if (value) {
            const granted = await requestPermissions();
            if (!granted) return;
            await scheduleHabitReminders();
        } else {
            await cancelHabitReminders();
        }
        setEnabled(value);
        await AsyncStorage.setItem(REMINDERS_KEY, value.toString());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Habit Reminders</Text>
            <Switch
                value={enabled}
                onValueChange={toggle}
                trackColor={{ false: colors.surface, true: colors.primary }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 30,
    },
    label: {
        color: colors.text,
        fontSize: 16,
    },
});
