import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Image,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from "react-native";
import icons from "@/assets/constants/icons";
import { getUserPosts, signOut } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/GlobalProvider";
import React, { useEffect, useState } from "react";
import { Post } from "./home";
import VideoCard from "@/components/VideoCard";
import EmptyState from "@/components/EmptyState";
import InfoBox from "@/components/InfoBox";
import Loader from "@/components/Loader";

export default function Profile() {
    const { user, setUser, setIsLogged } = useGlobalContext();
    const [posts, setPosts] = useState<Post[]>();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function fetchPosts() {
        try {
            setLoading(true);
            const response = await getUserPosts(user.$id);
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
            setPosts(posts);
            setLoading(false);
        } catch (error) {
            Alert.alert(
                "Error",
                "An error occurred while fetching data: " +
                    (error as Error).message
            );
            setLoading(false);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        setLoading(true);
        await signOut();
        setUser(null);
        setLoading(false);
        setIsLogged(false);

        router.replace("/sign-in");
    }

    async function onRefresh() {
        setRefreshing(true);
        await fetchPosts();
        setRefreshing(false);
    }

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
                            creator={item.creator.username}
                            avatar={item.creator.avatar}
                            isItInFav={false}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <EmptyState
                            title="No Videos Found"
                            subtitle="No videos found for this profile"
                        />
                    )}
                    ListHeaderComponent={() => (
                        <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
                            <TouchableOpacity
                                onPress={logout}
                                className="flex w-full items-end mb-10"
                            >
                                <Image
                                    source={icons.logout}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                />
                            </TouchableOpacity>

                            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
                                <Image
                                    source={{ uri: user?.avatar }}
                                    className="w-[90%] h-[90%] rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>

                            <InfoBox
                                title={user?.username}
                                containerStyles="mt-5"
                                titleStyles="text-lg"
                            />

                            <View className="mt-5 flex flex-row">
                                <InfoBox
                                    title={String(posts?.length) || "0"}
                                    subtitle="Posts"
                                    titleStyles="text-xl"
                                    containerStyles="mr-10"
                                />
                                <InfoBox
                                    title="1.2k"
                                    subtitle="Followers"
                                    titleStyles="text-xl"
                                />
                            </View>
                        </View>
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
