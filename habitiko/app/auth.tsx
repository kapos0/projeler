import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
    const theme = useTheme();
    const router = useRouter();
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const { signIn, signUp } = useAuth();

    async function handleAuth() {
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        setError(null);
        try {
            if (isSigningUp) {
                const error = await signUp(email, password);
                if (error) {
                    setError(error);
                    return;
                }
            } else {
                const error = await signIn(email, password);
                if (error) {
                    setError(error);
                    return;
                }

                router.replace("/");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.title} variant="headlineMedium">
                    {isSigningUp ? "Create Account" : "Welcome Back"}
                </Text>

                <TextInput
                    label="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="example@gmail.com"
                    mode="outlined"
                    style={styles.input}
                    onChangeText={setEmail}
                />

                <TextInput
                    label="Password"
                    autoCapitalize="none"
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setPassword}
                />

                {error && (
                    <Text
                        style={{ color: theme.colors.error, paddingLeft: 12 }}
                    >
                        {error}
                    </Text>
                )}

                <Button
                    mode="contained"
                    style={styles.button}
                    onPress={handleAuth}
                >
                    {isSigningUp ? "Sign Up" : "Sign In"}
                </Button>

                <Button
                    mode="text"
                    onPress={() => setIsSigningUp((prev) => !prev)}
                    style={styles.switchModeButton}
                >
                    {isSigningUp
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                </Button>
                <StatusBar style="dark" />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
    },
    title: {
        textAlign: "center",
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    switchModeButton: {
        marginTop: 16,
    },
});
