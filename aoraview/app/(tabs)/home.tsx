import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    RefreshControl,
    Image,
    Alert,
} from "react-native";
import images from "@/assets/constants/images";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import { useGlobalContext } from "@/lib/GlobalProvider";
import Trending from "@/components/Trending";
import { getAllPosts, getLatestPosts } from "@/lib/appwrite";
import Loader from "@/components/Loader";

export type Post = {
    $id: string;
    title: string;
    thumbnail: string;
    content: string;
    media: string;
    creator: {
        username: string;
        avatar: string;
    };
};

export default function Home() {
    const { user } = useGlobalContext();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Post[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [latestPosts, setLatestPosts] = useState<Post[]>([]);
    async function fetchData(isItRefreshing = false) {
        setLoading(true);
        try {
            const response = isItRefreshing
                ? await getLatestPosts()
                : await getAllPosts();
            const posts = response.map((doc: any) => ({
                $id: doc.$id,
                title: doc.title,
                thumbnail: doc.thumbnail,
                content: doc.content,
                media: doc.media,
                creator: {
                    username: doc.creator.username,
                    avatar: doc.creator.avatar,
                },
            }));
            (isItRefreshing ? setLatestPosts : setData)(posts);
        } catch (error) {
            Alert.alert(
                "Error",
                "An error occurred while fetching data: " +
                    (error as Error).message
            );
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
        onRefresh();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function onRefresh() {
        fetchData(true);
        setRefreshing(true);
        await fetchData();
        fetchData(false);
        setRefreshing(false);
    }
    return (
        <>
            <SafeAreaView className="bg-primary h-full">
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.$id.toString()}
                    renderItem={({ item }) => (
                        <VideoCard
                            title={item.title}
                            thumbnail={item.thumbnail}
                            media={item.media}
                            creator={item.creator.username}
                            avatar={item.creator.avatar}
                            mediaId={item.$id}
                            isItInFav={false}
                        />
                    )}
                    ListHeaderComponent={() => (
                        <View className="flex my-6 px-4 space-y-6">
                            <View className="flex justify-between items-start flex-row mb-6">
                                <View>
                                    <Text className="font-pmedium text-sm text-gray-100">
                                        Welcome Back
                                    </Text>
                                    <Text className="text-2xl font-psemibold text-white">
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

                            <View className="w-full flex-1 pt-5 pb-8">
                                <Text className="text-lg font-pregular text-gray-100 mb-3">
                                    Latest Posts
                                </Text>

                                <Trending posts={latestPosts ?? []} />
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <EmptyState
                            title="No Posts Found"
                            subtitle="No posts created yet"
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                />
            </SafeAreaView>
            <Loader isLoading={loading} />
        </>
    );
}
