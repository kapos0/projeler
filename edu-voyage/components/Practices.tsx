import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { PraticeOption } from "@/assets/constant/Option";
import Colors from "@/assets/constant/Colors";
import { useRouter } from "expo-router";

export default function Practices() {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.headingText}>Practices</Text>
            <FlatList
                data={PraticeOption}
                numColumns={3}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.practiceContainer}
                        onPress={() =>
                            router.push(`/practice-view/${item?.name}/`)
                        }
                    >
                        <Image
                            source={item?.image}
                            style={styles.practiceImage}
                        />
                        <Text style={styles.practiceText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    headingText: {
        fontSize: 25,
        fontWeight: "bold",
    },
    practiceContainer: {
        flex: 1,
        margin: 5,
        marginLeft: 10,
        aspectRatio: 1,
    },
    practiceImage: {
        width: "100%",
        height: "100%",
        maxHeight: 160,
        borderRadius: 15,
    },
    practiceText: {
        position: "absolute",
        padding: 15,
        fontSize: 15,
        color: Colors.WHITE,
    },
});
