import { useContext, useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserContext, userType } from "@/lib/UserContext";

import Colors from "@/assets/constant/Colors";
import landingImg from "@/assets/images/landing.png";

export default function Index() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user?.email) {
                setLoading(true);
                try {
                    const response = await getDoc(
                        doc(db, "users", user?.email)
                    );
                    const userData = response.data();
                    if (userData) {
                        setUser(userData as userType);
                        router.replace("/(tabs)/home");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            }
        });
        return () => unsubscribe();
    }, [router, setUser]);

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.image} source={landingImg} />
            <View style={styles.innerContainer}>
                <Text style={styles.innerContainerText}>
                    Welcome to EDU-VOYAGE
                </Text>
                <Text style={styles.innerContainerSubText}>
                    Transform your ideas into engaging educational content,
                    effortlessly with AI! 📚🤖
                </Text>
                {loading ? (
                    <ActivityIndicator size="large" color={Colors.WHITE} />
                ) : null}
                <TouchableOpacity
                    onPress={() => router.push("/auth/signUp")}
                    style={styles.button}
                >
                    <Text
                        style={[styles.buttonText, { color: Colors.PRIMARY }]}
                    >
                        Get Started
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push("/auth/signIn")}
                    style={[
                        styles.button,
                        {
                            backgroundColor: Colors.PRIMARY,
                            borderColor: Colors.WHITE,
                            borderWidth: 1,
                        },
                    ]}
                >
                    <Text style={[styles.buttonText, { color: Colors.WHITE }]}>
                        Already Have an Account?
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.WHITE,
    },
    image: {
        width: "100%",
        height: 300,
        marginTop: 70,
    },
    innerContainer: {
        padding: 25,
        backgroundColor: Colors.PRIMARY,
        height: "100%",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
    },
    innerContainerText: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        color: Colors.WHITE,
    },
    innerContainerSubText: {
        fontSize: 20,
        textAlign: "center",
        color: Colors.WHITE,
        marginVertical: 20,
    },
    button: {
        padding: 20,
        backgroundColor: Colors.WHITE,
        marginTop: 20,
        borderRadius: 10,
    },
    buttonText: {
        textAlign: "center",
        fontSize: 18,
    },
});
