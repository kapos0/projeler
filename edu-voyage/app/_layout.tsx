import { useState } from "react";
import { Stack } from "expo-router";
import { UserContext, userType } from "@/lib/UserContext";

import "@/assets/styles.css";

export default function RootLayout() {
    const [user, setUser] = useState<userType | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Stack screenOptions={{ headerShown: false }} />
        </UserContext.Provider>
    );
}
