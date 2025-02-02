import images from "@/assets/constants/images";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import VideoCard from "@/components/VideoCard";
import { getUserFavs } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/GlobalProvider";
import React, { useEffect, useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookMarkPage() {
    const { user } = useGlobalContext();
    const [fav_medias, setFavMedias] = useState();
    const [refresing, setRefreshing] = useState(false);
    async function onRefresh() {
        setRefreshing(true);
        const result = await getUserFavs();
        setFavMedias(result);
        setRefreshing(false);
    }
    useEffect(() => {
        onRefresh();
    }, [user]);

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Favorites Found"
                        subtitle="Added favorites can be found here"
                    />
                )}
                data={fav_medias}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <VideoCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        media={item.media}
                        creator={item.creator.username}
                        avatar={item.creator.avatar}
                        isItInFav={true}
                        mediaId={item.$id}
                        onFavChange={onRefresh}
                    />
                )}
                ListHeaderComponent={
                    <View className="flex my-6 px-4 space-y-6">
                        <View className="flex justify-between items-start flex-row mb-6">
                            <View>
                                <Text className="font-pmedium text-sm text-gray-100">
                                    Saved Videos
                                </Text>
                                <Text className="font-psemibold text-white">
                                    {user.username}
                                </Text>
                            </View>

                            <View className="mt-1.5">
                                <Image
                                    source={images.logoSmall}
                                    className="w-9 h-10"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        <SearchInput />
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refresing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
}
