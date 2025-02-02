import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { ResizeMode, Video } from "expo-av";

import icons from "@/assets/constants/icons";
import { addFavMedia, removeFavMedia } from "@/lib/appwrite";

export default function VideoCard({
    title,
    creator,
    avatar,
    thumbnail,
    media,
    isItInFav,
    mediaId,
    onFavChange,
}: {
    title: string;
    creator: string;
    avatar: string;
    thumbnail: string;
    media: string;
    isItInFav: boolean;
    mediaId?: string;
    onFavChange: () => void;
}) {
    const [play, setPlay] = useState(false);
    async function handleRemoveFav(mediaId: string) {
        await removeFavMedia(mediaId || "");
        onFavChange();
    }
    async function handleAddFav(mediaId: string) {
        await addFavMedia(mediaId || "");
        onFavChange();
    }
    return (
        <View className="flex flex-col items-center px-4 mb-14">
            <View className="flex flex-row gap-3 items-start">
                <View className="flex justify-center items-center flex-row flex-1">
                    <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                    </View>

                    <View className="flex justify-center flex-1 ml-3 gap-y-1">
                        <Text
                            className="font-psemibold text-sm text-white"
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                        <Text
                            className="text-xs text-gray-100 font-pregular"
                            numberOfLines={1}
                        >
                            {creator}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="pt-2"
                    onPress={
                        isItInFav
                            ? () => handleRemoveFav(mediaId || "")
                            : () => handleAddFav(mediaId || "")
                    }
                >
                    <Image
                        source={
                            isItInFav
                                ? icons.bookMarkHeart
                                : icons.bookMarkHeartFill
                        }
                        className="w-5 h-5"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>

            {play ? (
                <Video
                    source={{ uri: media }}
                    style={{
                        width: "100%",
                        height: 240,
                        borderRadius: 12,
                        marginTop: 12,
                    }}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded && status.didJustFinish)
                            setPlay(false);
                    }}
                />
            ) : (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                    className="w-full h-60 rounded-xl mt-3 relative flex justify-center items-center"
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full rounded-xl mt-3"
                        resizeMode="contain"
                    />

                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}
