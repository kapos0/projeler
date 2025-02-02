import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { searchPosts } from "@/lib/appwrite";
import VideoCard from "@/components/VideoCard";
import SearchInput from "@/components/SearchInput";
import EmptyState from "@/components/EmptyState";
import { Post } from "../(tabs)/home";
import Loader from "@/components/Loader";

export default function Search() {
    const { query } = useLocalSearchParams();
    const [posts, setPosts] = useState<Post[]>();
    const [loading, setLoading] = useState(false);
    async function getData() {
        try {
            setLoading(true);
            const res = await searchPosts(query.toString());
            const posts = res.map((doc: any) => ({
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
            setPosts(posts);
            setLoading(false);
        } catch (error) {
            setPosts([]);
            setLoading(false);
            Alert.alert(
                "Error",
                `Failed to fetch data ${(error as Error).message}`
            );
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return (
        <>
            <SafeAreaView className="bg-primary h-full">
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.$id}
                    renderItem={({ item }) => (
                        <VideoCard
                            title={item.title}
                            thumbnail={item.thumbnail}
                            media={item.media}
                            isItInFav={false}
                            creator={item.creator.username}
                            avatar={item.creator.avatar}
                        />
                    )}
                    ListHeaderComponent={() => (
                        <View className="flex my-6 px-4">
                            <Text className="font-pmedium text-gray-100 text-sm">
                                Search Results
                            </Text>
                            <Text className="text-2xl font-psemibold text-white mt-1">
                                {query}
                            </Text>

                            <View className="mt-6 mb-8">
                                <SearchInput initialQuery={query.toString()} />
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <EmptyState
                            title="No Videos Found"
                            subtitle="No videos found for this search query"
                        />
                    )}
                />
            </SafeAreaView>
            <Loader isLoading={loading} />
        </>
    );
}
