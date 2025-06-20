import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Platform, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, isLoadingUser } = useAuth();
    const segments = useSegments();

    useEffect(() => {
        const inAuthGroup = segments[0] === "auth";
        if (!user && !inAuthGroup && !isLoadingUser) router.replace("/auth");
        else if (user && inAuthGroup && !isLoadingUser) router.replace("/");
    }, [user, segments, isLoadingUser, router]);

    return <>{children}</>;
}

export default function RootLayout() {
    const { width: windowWidth } = useWindowDimensions();
    const isWeb = Platform.OS === "web";
    const containerStyle = {
        flex: 1,
        width: isWeb ? Math.min(windowWidth, 720) : undefined,
        borderRadius: 20,
        marginTop: isWeb ? 0 : 24,
    };
    const content = (
        <GestureHandlerRootView style={containerStyle}>
            <AuthProvider>
                <PaperProvider theme={{ mode: "exact", dark: false }}>
                    <SafeAreaProvider>
                        <RouteGuard>
                            <Stack>
                                <Stack.Screen
                                    name="(tabs)"
                                    options={{ headerShown: false }}
                                />
                            </Stack>
                        </RouteGuard>
                    </SafeAreaProvider>
                </PaperProvider>
            </AuthProvider>
        </GestureHandlerRootView>
    );
    if (isWeb) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "stretch",
                    minHeight: "100vh",
                    maxWidth: "100%",
                }}
            >
                {content}
            </div>
        );
    }
    return content;
}
