import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from "react-native";
import images from "@/assets/constants/images";
import FormField from "@/components/FormField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { signIn } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/GlobalProvider";

export default function SignIn() {
    const { setUser, setIsLogged } = useGlobalContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    async function submit() {
        if (form.email === "" || form.password === "")
            Alert.alert("Error", "Please fill in all fields");

        setIsSubmitting(true);
        try {
            const result = await signIn(form.email, form.password);
            setUser(result);
            setIsLogged(true);
            router.replace("/home");
        } catch (error) {
            Alert.alert("Error", (error as any).message);
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View className="w-full justify-center h-full px-4 my-12">
                    <Image
                        source={images.logo}
                        resizeMode="contain"
                        className="w-[115px] h-[35px]"
                    />
                    <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
                        Log in to AoraView
                    </Text>
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) =>
                            setForm({ ...form, password: e })
                        }
                        otherStyles="mt-7"
                    />
                    <CustomButton
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={isSubmitting}
                    />
                    <View className="flex justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link
                            href="/sign-up"
                            className="text-lg font-psemibold text-secondary"
                        >
                            Signup
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
