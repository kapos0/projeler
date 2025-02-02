import React, { useState, useCallback } from "react";
import {
    FlatList,
    Image,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import * as Animatable from "react-native-animatable";
import icons from "@/assets/constants/icons";

const zoomIn = {
    from: {
        transform: [{ scale: 0.9 }],
    },
    to: {
        transform: [{ scale: 1.1 }],
    },
};

const zoomOut = {
    from: {
        transform: [{ scale: 1 }],
    },
    to: {
        transform: [{ scale: 0.9 }],
    },
};

function Item({ activeItem, item }: { activeItem: any; item: any }) {
    const [play, setPlay] = useState(false);
    return (
        <Animatable.View
            className="mr-5"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {play ? (
                <Video
                    source={{ uri: item.media }}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    style={{
                        width: 208 /* w-52 */,
                        height: 312 /* h-72 */,
                        borderRadius: 33 /* rounded-[33px] */,
                        marginTop: 12 /* mt-3 */,
                        backgroundColor:
                            "rgba(255, 255, 255, 0.1)" /* bg-white/10 */,
                    }}
                    shouldPlay
                    onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded && status.didJustFinish)
                            setPlay(false);
                    }}
                />
            ) : (
                <TouchableOpacity
                    className="relative flex justify-center items-center"
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                >
                    <ImageBackground
                        source={{
                            uri: item.thumbnail,
                        }}
                        className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
                        resizeMode="cover"
                    />

                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </Animatable.View>
    );
}

export default function Trending({ posts }: { posts: any }) {
    const [activeItem, setActiveItem] = useState(posts[0]);

    const viewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: any }) => {
            if (viewableItems.length > 0) setActiveItem(viewableItems[0].key);
        },
        []
    );

    return (
        <FlatList
            data={posts}
            horizontal
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => (
                <Item activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70,
            }}
            contentOffset={{ x: 170, y: 0 }}
        />
    );
}
