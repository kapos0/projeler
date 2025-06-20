import {
    client,
    COMPLETIONS_COLLECTION_ID,
    DATABASE_ID,
    databases,
    HABITS_COLLECTION_ID,
    RealtimeResponse,
} from "@/lib/appwrite";
import { Habit, HabitCompletion } from "@/lib/databaseTypes";
import { useCallback, useEffect, useState } from "react";
import { Query } from "react-native-appwrite";

export function useHabits(user: { $id: string } | null) {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>(
        []
    );

    const fetchHabits = useCallback(async () => {
        if (!user) return;
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                [Query.equal("user_id", user.$id)]
            );
            setHabits(response.documents as Habit[]);
        } catch (error) {
            console.error("Error fetching habits:", error);
        }
    }, [user]);

    const fetchCompletions = useCallback(async () => {
        if (!user) return;
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const response = await databases.listDocuments(
                DATABASE_ID,
                COMPLETIONS_COLLECTION_ID,
                [
                    Query.equal("user_id", user.$id),
                    Query.greaterThanEqual("completed_at", today.toISOString()),
                ]
            );
            setCompletedHabits(response.documents as HabitCompletion[]);
        } catch (error) {
            console.error("Error fetching completions:", error);
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        fetchHabits();
        fetchCompletions();

        const habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
        const completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;

        const habitsSubscription = client.subscribe(
            habitsChannel,
            (response: RealtimeResponse) => {
                if (
                    response.events.some(
                        (e) =>
                            e.endsWith(".create") ||
                            e.endsWith(".update") ||
                            e.endsWith(".delete")
                    )
                ) {
                    fetchHabits();
                }
            }
        );

        const completionsSubscription = client.subscribe(
            completionsChannel,
            (response: RealtimeResponse) => {
                if (
                    response.events.some(
                        (e) =>
                            e.endsWith(".create") ||
                            e.endsWith(".update") ||
                            e.endsWith(".delete")
                    )
                ) {
                    fetchCompletions();
                }
            }
        );

        return () => {
            habitsSubscription();
            completionsSubscription();
        };
    }, [user, fetchHabits, fetchCompletions]);

    return {
        habits,
        completedHabits,
        fetchHabits,
        fetchCompletions,
    };
}
