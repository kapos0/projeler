import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: { backgroundColor: "#f5f5f5" },
                headerShown: false,
                headerShadowVisible: false,
                tabBarStyle: {
                    backgroundColor: "#f5f5f5",
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: "#6200ee",
                tabBarInactiveTintColor: "#666666",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Today's Habits",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="streaks"
                options={{
                    title: "Streaks",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="stats-chart"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="add-habit"
                options={{
                    title: "Add Habit",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="add-circle" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
