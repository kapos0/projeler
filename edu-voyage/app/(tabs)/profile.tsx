import React, { useContext, useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useRouter } from "expo-router";

import { auth } from "@/lib/firebase";
import { UserContext } from "@/lib/UserContext";

import Button from "@/components/Button";

import Colors from "@/assets/constant/Colors";

export default function ProfilePage() {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    if (!user) auth.currentUser && router.push("/auth/signIn");

    async function handleLogOut() {
        try {
            setLoading(true);
            await auth.signOut();
            router.push("/auth/signIn");
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Profile</Text>
            <Image
                source={require("@/assets/images/logo.png")}
                style={styles.userImage}
            />
            <View style={styles.userDetails}>
                <Text style={styles.usernameText}>{user?.username}</Text>
                <Text style={styles.userEmailText}>{user?.email}</Text>
                <Button
                    text="+ Add Course"
                    type="fill"
                    onPress={() => router.push("/add-course")}
                    loading={loading}
                />
                <Button
                    text="Log out"
                    type="fill"
                    isDanger
                    onPress={() =>
                        Alert.alert(
                            "Log out",
                            "Are you sure you want to log out?",
                            [
                                { text: "Cancel", style: "cancel" },
                                { text: "OK", onPress: handleLogOut },
                            ]
                        )
                    }
                    loading={loading}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        display: "flex",
        flexDirection: "column",
        padding: 25,
    },
    heading: {
        fontSize: 32,
        fontWeight: "bold",
    },
    userImage: {
        height: 240,
        width: 240,
        alignSelf: "center",
    },
    userDetails: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    usernameText: {
        fontWeight: "bold",
        fontSize: 25,
        marginVertical: 10,
    },
    userEmailText: {
        fontSize: 20,
        color: Colors.GRAY,
    },
});
