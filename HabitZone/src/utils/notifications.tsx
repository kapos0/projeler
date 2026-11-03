import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export const requestPermissions = async (): Promise<boolean> => {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
};

export const scheduleHabitReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "HabitZone",
            body: "Don't forget to check in on your habits!",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 12,
            minute: 0,
        },
    });

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "HabitZone",
            body: "Take a moment to complete your habits today.",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 18,
            minute: 0,
        },
    });
};

export const cancelHabitReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};
