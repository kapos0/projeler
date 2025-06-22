import { useEffect } from "react";
import {
    Text,
    View,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";
import PostItImage from "@/assets/images/post-it.png";

export default function Index() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) router.replace("/notes");
    }, [user, loading]);

    if (loading) {
        return (
            <View style={styles.centeredContainter}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={PostItImage} style={styles.image} />
            <Text style={styles.title}>Welcome To Notes App</Text>
            <Text style={styles.subtitle}>
                Capture your thoughts anytime, anywhere
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/notes")}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007bff",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    centeredContainter: {
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
});
