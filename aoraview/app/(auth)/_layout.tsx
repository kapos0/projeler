import React from "react";
import { Redirect, Stack } from "expo-router";
import Loader from "@/components/Loader";
import { useGlobalContext } from "@/lib/GlobalProvider";

export default function AuthLayout() {
    const { loading, isLogged } = useGlobalContext();
    if (!loading && isLogged) return <Redirect href="/home" />;
    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="sign-in" />
                <Stack.Screen name="sign-up" />
            </Stack>

            <Loader isLoading={loading} />
        </>
    );
}
