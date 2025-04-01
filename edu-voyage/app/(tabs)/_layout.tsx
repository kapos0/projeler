import React from "react";
import { Tabs } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="home"
                options={{
                    tabBarIcon: ({ size, color }) => {
                        return (
                            <Ionicons
                                name="home-outline"
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarLabel: "Home",
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    tabBarIcon: ({ size, color }) => {
                        return (
                            <Ionicons
                                name="search-outline"
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarLabel: "Explore",
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    tabBarIcon: ({ size, color }) => {
                        return (
                            <Ionicons
                                name="trending-up"
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarLabel: "Progress",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ size, color }) => {
                        return (
                            <Ionicons
                                name="person-outline"
                                size={size}
                                color={color}
                            />
                        );
                    },
                    tabBarLabel: "Profile",
                }}
            />
        </Tabs>
    );
}
