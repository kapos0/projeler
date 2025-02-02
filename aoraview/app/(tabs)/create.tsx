import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import React, { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { useGlobalContext } from "@/lib/GlobalProvider";
import { createMediaPost } from "@/lib/appwrite";
import { router } from "expo-router";
import { ResizeMode, Video } from "expo-av";
import FormField from "@/components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "@/assets/constants/icons";
import CustomButton from "@/components/CustomButton";

export default function Create() {
    const { user } = useGlobalContext();
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState<{
        title: string;
        media: DocumentPicker.DocumentPickerAsset | null;
        thumbnail: DocumentPicker.DocumentPickerAsset | null;
        content: string;
    }>({
        title: "",
        media: null,
        thumbnail: null,
        content: "",
    });

    async function openPicker(selectType: "image" | "video") {
        const result = await DocumentPicker.getDocumentAsync({
            type:
                selectType === "image"
                    ? ["image/png", "image/jpg", "image/jpeg"]
                    : ["video/mp4", "video/gif"],
        });

        if (!result.canceled) {
            if (selectType === "image") {
                setForm({
                    ...form,
                    thumbnail: result.assets[0],
                });
            }

            if (selectType === "video") {
                setForm({
                    ...form,
                    media: result.assets[0],
                });
            }
        } else {
            setTimeout(() => {
                Alert.alert("Document picked", JSON.stringify(result, null, 2));
            }, 100);
        }
    }

    async function submit() {
        if (
            form.content === "" ||
            form.title === "" ||
            !form.thumbnail ||
            !form.media
        ) {
            return Alert.alert("Please provide all fields");
        }

        setUploading(true);
        try {
            await createMediaPost({
                ...form,
                userId: user.$id,
                media: form.media,
                content: form.content,
            });

            Alert.alert("Success", "Post uploaded successfully");
            router.push("/home");
        } catch (error) {
            Alert.alert(
                "Error",
                "An error occurred while fetching data: " +
                    (error as Error).message
            );
        } finally {
            setForm({
                title: "",
                media: null,
                thumbnail: null,
                content: "",
            });

            setUploading(false);
        }
    }
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-white font-psemibold">
                    Upload Video
                </Text>

                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Give your video a catchy title..."
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Upload Video
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("video")}>
                        {form.media ? (
                            <Video
                                source={{ uri: form.media?.uri || "" }}
                                style={{
                                    width: "100%",
                                    height: 240,
                                    borderRadius: 12,
                                    marginTop: 12,
                                }}
                                useNativeControls
                                resizeMode={ResizeMode.CONTAIN}
                                shouldPlay
                                isLooping
                            />
                        ) : (
                            <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                                    <Image
                                        source={icons.upload}
                                        resizeMode="cover"
                                        alt="upload"
                                        className="w-1/2 h-1/2"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">
                        Thumbnail Image
                    </Text>

                    <TouchableOpacity onPress={() => openPicker("image")}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                resizeMode="contain"
                                className="w-full h-64 rounded-2xl"
                            />
                        ) : (
                            <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                                <Image
                                    source={icons.upload}
                                    resizeMode="contain"
                                    alt="upload"
                                    className="w-5 h-5"
                                />
                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <FormField
                    title="Content"
                    value={form.content}
                    placeholder="The content of your video..."
                    handleChangeText={(e) => setForm({ ...form, content: e })}
                    otherStyles="mt-7"
                />

                <CustomButton
                    title="Submit & Publish"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
