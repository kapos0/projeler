import { Habit } from "@/storage/habits";
import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { Share, TouchableOpacity } from "react-native";

type ShareButtonProps = {
    habits: Habit[];
};

export default function ShareButton({ habits }: ShareButtonProps) {
    const handleShare = async () => {
        await Share.share({
            message:
                habits.length === 0
                    ? "HabitZone\n\nNo habits added yet."
                    : `HabitZone\n\n${habits
                          .map(
                              (habit) =>
                                  `${habit.name} - ${habit.streak} day streak (${habit.frequency})`,
                          )
                          .join("\n")}`,
        });
    };

    return (
        <TouchableOpacity onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
    );
}
