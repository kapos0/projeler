import {
    COMPLETIONS_COLLECTION_ID,
    DATABASE_ID,
    databases,
    HABITS_COLLECTION_ID,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useHabits } from "@/lib/useHabits";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Button, Surface, Text } from "react-native-paper";

export default function Index() {
    const router = useRouter();
    const { user, signOut, isLoadingUser } = useAuth();

    useEffect(() => {
        if (!user && !isLoadingUser) {
            router.push("/auth");
        }
    }, [user, isLoadingUser, router]);

    const { habits, completedHabits } = useHabits(user);
    const swipeableRefs = useRef<{
        [key: string]: React.ComponentRef<typeof Swipeable> | null;
    }>({});

    const isHabitCompleted = (habitId: string) =>
        completedHabits?.some((c) => c.habit_id === habitId);

    async function handleDeleteHabit(id: string) {
        try {
            await databases
                .listDocuments(DATABASE_ID, COMPLETIONS_COLLECTION_ID, [
                    Query.equal("habit_id", id),
                ])
                .then((response: { documents: any[] }) => {
                    response.documents.forEach(async (completion: any) => {
                        await databases.deleteDocument(
                            DATABASE_ID,
                            COMPLETIONS_COLLECTION_ID,
                            completion.$id
                        );
                    });
                });
            await databases.deleteDocument(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                id
            );
        } catch (error) {
            console.error(error);
        }
    }

    async function handleCompleteHabit(id: string) {
        if (!user || isHabitCompleted(id)) return;
        try {
            const currentDate = new Date().toISOString();
            await databases.createDocument(
                DATABASE_ID,
                COMPLETIONS_COLLECTION_ID,
                ID.unique(),
                {
                    habit_id: id,
                    user_id: user.$id,
                    completed_at: currentDate,
                }
            );

            const habit = habits?.find((h) => h.$id === id);
            if (!habit) return;

            await databases.updateDocument(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                id,
                {
                    streak_count: habit.streak_count + 1,
                    last_completed: currentDate,
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    const renderRightActions = (habitId: string) => (
        <View style={styles.swipeActionRight}>
            {isHabitCompleted(habitId) ? (
                <Text style={{ color: "#fff" }}>Completed!</Text>
            ) : (
                <FontAwesome5 name="check" size={32} color={"#fff"} />
            )}
        </View>
    );

    const renderLeftActions = () => (
        <View style={styles.swipeActionLeft}>
            <FontAwesome5 name="trash" size={32} color={"#fff"} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineSmall">Todays Habits</Text>
                <Button mode="text" onPress={signOut} icon={"logout"}>
                    Sign Out
                </Button>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {habits.length > 0 ? (
                    habits.map((habit, key) => (
                        <Swipeable
                            key={key}
                            ref={(ref) => {
                                swipeableRefs.current[habit.$id] = ref;
                            }}
                            overshootLeft={false}
                            overshootRight={false}
                            renderLeftActions={renderLeftActions}
                            renderRightActions={() =>
                                renderRightActions(habit.$id)
                            }
                            onSwipeableOpen={(direction) => {
                                if (direction === "right") {
                                    handleDeleteHabit(habit.$id);
                                } else if (direction === "left") {
                                    handleCompleteHabit(habit.$id);
                                }

                                swipeableRefs.current[habit.$id]?.close();
                            }}
                        >
                            <Surface
                                style={[
                                    styles.card,
                                    isHabitCompleted(habit.$id) &&
                                        styles.cardCompleted,
                                ]}
                                elevation={0}
                            >
                                <View style={styles.cardContent} key={key}>
                                    <Text style={styles.cardTitle}>
                                        {habit.title}
                                    </Text>
                                    <Text style={styles.cardDescription}>
                                        {habit.description}
                                    </Text>
                                    <View style={styles.cardFooter}>
                                        <View style={styles.streakBadge}>
                                            <FontAwesome5
                                                name="fire"
                                                size={18}
                                                color="#ff9800"
                                            />
                                            <Text style={styles.streakText}>
                                                {habit.streak_count} day streak
                                            </Text>
                                        </View>
                                        <View style={styles.frequencyBadge}>
                                            <Text style={styles.frequencyText}>
                                                {habit.frequency
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    habit.frequency.slice(1)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Surface>
                        </Swipeable>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>
                            No Habits yet. Add your first Habit!
                        </Text>
                    </View>
                )}
            </ScrollView>
            <StatusBar style="dark" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    title: {
        fontWeight: "bold",
    },

    card: {
        marginBottom: 18,
        borderRadius: 18,
        backgroundColor: "#f7f2fa",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },

    cardCompleted: {
        opacity: 0.6,
    },
    cardContent: {
        padding: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#22223b",
    },
    cardDescription: {
        fontSize: 15,
        marginBottom: 16,
        color: "#6c6c80",
    },
    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    streakBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff3e0",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    streakText: {
        marginLeft: 6,
        color: "#ff9800",
        fontWeight: "bold",
        fontSize: 14,
    },
    frequencyBadge: {
        backgroundColor: "#ede7f6",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    frequencyText: {
        color: "#7c4dff",
        fontWeight: "bold",
        fontSize: 14,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyStateText: {
        color: "#666666",
    },
    swipeActionLeft: {
        justifyContent: "center",
        alignItems: "flex-start",
        flex: 1,
        backgroundColor: "#e53935",
        borderRadius: 18,
        marginBottom: 18,
        marginTop: 2,
        paddingLeft: 16,
    },
    swipeActionRight: {
        justifyContent: "center",
        alignItems: "flex-end",
        flex: 1,
        backgroundColor: "#4caf50",
        borderRadius: 18,
        marginBottom: 18,
        marginTop: 2,
        paddingRight: 16,
    },
});
