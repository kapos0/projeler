import React from "react";
import { Redirect, Tabs } from "expo-router";
import { Image, View } from "react-native";
import Loader from "@/components/Loader";
import icons from "@/assets/constants/icons";
import { useGlobalContext } from "@/lib/GlobalProvider";

function TabIcon({ icon, color }: { icon: any; color: string }) {
    return (
        <View className="flex items-center justify-center gap-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"
            />
        </View>
    );
}

export default function TabsLayout() {
    const { loading, isLogged } = useGlobalContext();
    if (!loading && !isLogged) return <Redirect href="/(auth)/sign-in" />;
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#FFA001",
                    tabBarInactiveTintColor: "#CDCDE0",
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#161622",
                        borderTopWidth: 1,
                        borderTopColor: "#232533",
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarIcon: ({ color }: { color: string }) => (
                            <TabIcon icon={icons.home} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="bookmark"
                    options={{
                        title: "Bookmark",
                        tabBarIcon: ({ color }: { color: string }) => (
                            <TabIcon icon={icons.bookmark} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="create"
                    options={{
                        title: "Create",
                        tabBarIcon: ({ color }: { color: string }) => (
                            <TabIcon icon={icons.plus} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color }: { color: string }) => (
                            <TabIcon icon={icons.profile} color={color} />
                        ),
                    }}
                />
            </Tabs>

            <Loader isLoading={loading} />
        </>
    );
}
