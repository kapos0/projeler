import React, { useContext, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import { UserContext, userType } from "@/lib/UserContext";

import styles from "./authStyles";
import logoImg from "@/assets/images/logo.png";
import Colors from "@/assets/constant/Colors";

export default function SignUpPage() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);

    async function createAccount() {
        if (
            !userName.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()
        ) {
            setError("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = response.user;
            await saveUserToDB(user?.uid);
            setUserName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            router.replace("/(tabs)/home");
        } catch (error) {
            console.error((error as Error).message);
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    async function saveUserToDB(user_uid: string) {
        try {
            const userData = {
                username: userName,
                email: email,
                password: password,
                member: false,
                uid: user_uid,
            };
            if (userData) {
                await setDoc(doc(db, "users", email), userData);
                setUser(userData as userType);
            }
        } catch (error) {
            console.error("Error saving user to database:", error);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={80}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <SafeAreaView style={styles.container}>
                    <Image source={logoImg} style={styles.logo} />
                    <Text style={styles.containerHeaderText}>
                        Create New Account
                    </Text>
                    {error ? <Text>{error}</Text> : null}
                    <TextInput
                        style={styles.input}
                        placeholder="User Name"
                        onChangeText={(value) => setUserName(value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        onChangeText={(value) => setEmail(value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        onChangeText={(value) => setPassword(value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry
                        onChangeText={(value) => setConfirmPassword(value)}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={createAccount}
                        disabled={loading}
                    >
                        {!loading ? (
                            <Text style={styles.buttonText}>
                                Create Account
                            </Text>
                        ) : (
                            <ActivityIndicator
                                size="large"
                                color={Colors.WHITE}
                            />
                        )}
                    </TouchableOpacity>
                    <Pressable
                        onPress={() => router.push("/auth/signIn")}
                        style={{ marginTop: 25 }}
                    >
                        <Text style={{ textDecorationLine: "underline" }}>
                            Already have an account?
                        </Text>
                    </Pressable>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
