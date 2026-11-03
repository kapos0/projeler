import AsyncStorage from "@react-native-async-storage/async-storage";

export type Habit = {
    id: string;
    name: string;
    frequency: string;
    streak: number;
    goal: string;
    createdAt: string;
};

const HABITS_KEY = "habits";

export const getHabits = async (): Promise<Habit[]> => {
    const data = await AsyncStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
};

export const addHabit = async (
    habit: Omit<Habit, "id" | "createdAt">,
): Promise<Habit> => {
    const habits = await getHabits();
    const newHabit: Habit = {
        ...habit,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(
        HABITS_KEY,
        JSON.stringify([newHabit, ...habits]),
    );
    return newHabit;
};

export const deleteHabit = async (id: string): Promise<void> => {
    const habits = await getHabits();
    const filtered = habits.filter((habit) => habit.id !== id);
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(filtered));
};

export const clearAllHabits = async (): Promise<void> => {
    await AsyncStorage.removeItem(HABITS_KEY);
};
