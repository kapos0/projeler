import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { File, Paths } from "expo-file-system";
import type * as Notifications from "expo-notifications";
import * as Sharing from "expo-sharing";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { loadSubscriptions, saveSubscriptions } from "@/lib/storage";
import {
    daysUntil,
    formatDate,
    formatPrice,
    Subscription,
} from "@/types/subscription";

type NotificationsModule = typeof Notifications;
let notificationsPromise: Promise<NotificationsModule | null> | undefined;

const getNotifications = () => {
    notificationsPromise ??= import("expo-notifications")
        .then((module) => {
            module.setNotificationHandler({
                handleNotification: async () => ({
                    shouldPlaySound: true,
                    shouldSetBadge: false,
                    shouldShowBanner: true,
                    shouldShowList: true,
                }),
            });
            return module;
        })
        .catch(() => null);
    return notificationsPromise;
};

type FormState = {
    name: string;
    price: string;
    currency: string;
    dueDate: string;
    category: string;
};

const emptyForm: FormState = {
    name: "",
    price: "",
    currency: "TRY",
    dueDate: "",
    category: "Genel",
};

const colors = {
    background: "#F7F8FC",
    card: "#FFFFFF",
    ink: "#182230",
    muted: "#748094",
    primary: "#635BFF",
    primarySoft: "#EEEDFF",
    border: "#E8EAF0",
    green: "#16845B",
    greenSoft: "#E5F7EF",
    orange: "#B86B00",
    orangeSoft: "#FFF2DC",
    red: "#C44040",
};

export default function Index() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [modalVisible, setModalVisible] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSubscriptions()
            .then(setSubscriptions)
            .catch(() => Alert.alert("Hata", "Kayıtlar yüklenemedi."))
            .finally(() => setLoading(false));
    }, []);

    const updateSubscriptions = (next: Subscription[]) => {
        setSubscriptions(next);
        saveSubscriptions(next).catch(() =>
            Alert.alert("Hata", "Değişiklik kaydedilemedi."),
        );
    };

    const summary = useMemo(() => {
        const upcoming = subscriptions.filter(
            (item) =>
                !item.paid &&
                daysUntil(item.dueDate) >= 0 &&
                daysUntil(item.dueDate) <= 7,
        );
        const paid = subscriptions.filter((item) => item.paid);
        const monthlyTotal = subscriptions.reduce(
            (total, item) => total + item.price,
            0,
        );
        return { upcoming, paid, monthlyTotal };
    }, [subscriptions]);

    const addSubscription = async () => {
        const price = Number(form.price.replace(",", "."));
        if (!form.name.trim() || !Number.isFinite(price) || price <= 0) {
            Alert.alert("Eksik bilgi", "Ad ve geçerli bir fiyat girin.");
            return;
        }
        if (!form.dueDate) {
            Alert.alert("Eksik tarih", "Sonraki ödeme tarihini seçin.");
            return;
        }

        const subscription: Subscription = {
            id: `${Date.now()}`,
            name: form.name.trim(),
            price,
            currency: form.currency.trim().toUpperCase() || "TRY",
            dueDate: form.dueDate,
            category: form.category.trim() || "Genel",
            paid: false,
        };
        const notifications = await getNotifications();
        const reminderDate = new Date(`${form.dueDate}T09:00:00`);
        let notificationId: string | undefined;
        if (notifications) {
            const permissions = await notifications.requestPermissionsAsync();
            if (permissions.status !== "granted") {
                Alert.alert(
                    "Bildirim izni gerekli",
                    "Ödeme günü hatırlatması için bildirim iznine izin verin.",
                );
            } else {
                if (Platform.OS === "android") {
                    await notifications.setNotificationChannelAsync(
                        "payments",
                        {
                            name: "Ödeme hatırlatmaları",
                            importance: 3,
                        },
                    );
                }
                if (reminderDate.getTime() > Date.now()) {
                    notificationId =
                        await notifications.scheduleNotificationAsync({
                            content: {
                                title: "Ödeme günü",
                                body: `${subscription.name} aboneliğinin ödemesi bugün.`,
                                ...(Platform.OS === "android"
                                    ? { channelId: "payments" }
                                    : {}),
                                data: { subscriptionId: subscription.id },
                            },
                            trigger: {
                                type: notifications.SchedulableTriggerInputTypes
                                    .DATE,
                                date: reminderDate,
                            },
                        });
                }
            }
        }
        updateSubscriptions([
            ...subscriptions,
            { ...subscription, notificationId },
        ]);
        setForm(emptyForm);
        setModalVisible(false);
    };

    const togglePaid = (id: string) => {
        const item = subscriptions.find((entry) => entry.id === id);
        if (!item) return;
        const paid = !item.paid;
        if (paid && item.notificationId) {
            getNotifications().then((notifications) =>
                notifications
                    ?.cancelScheduledNotificationAsync(item.notificationId!)
                    .catch(() => undefined),
            );
        }
        updateSubscriptions(
            subscriptions.map((entry) =>
                entry.id === id ? { ...entry, paid } : entry,
            ),
        );
    };

    const removeSubscription = (item: Subscription) => {
        Alert.alert("Aboneliği sil", `${item.name} silinsin mi?`, [
            { text: "Vazgeç", style: "cancel" },
            {
                text: "Sil",
                style: "destructive",
                onPress: () => {
                    if (item.notificationId) {
                        getNotifications().then((notifications) =>
                            notifications
                                ?.cancelScheduledNotificationAsync(
                                    item.notificationId!,
                                )
                                .catch(() => undefined),
                        );
                    }
                    updateSubscriptions(
                        subscriptions.filter((entry) => entry.id !== item.id),
                    );
                },
            },
        ]);
    };

    const exportBackup = async () => {
        if (subscriptions.length === 0) {
            Alert.alert(
                "Yedeklenebilir abonelik yok",
                "Önce en az bir abonelik ekleyin.",
            );
            return;
        }
        try {
            const file = new File(
                Paths.cache,
                `abonelik-yedegi-${Date.now()}.json`,
            );
            file.create();
            await file.write(
                JSON.stringify(
                    {
                        version: 1,
                        exportedAt: new Date().toISOString(),
                        subscriptions,
                    },
                    null,
                    2,
                ),
            );
            if (Platform.OS === "web") {
                await Share.share({
                    message: JSON.stringify(subscriptions, null, 2),
                });
            } else if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(file.uri, {
                    mimeType: "application/json",
                    dialogTitle: "Abonelik yedeğini paylaş",
                });
            } else {
                Alert.alert(
                    "Yedek hazır",
                    "Cihazınız paylaşım ekranını desteklemiyor.",
                );
            }
        } catch {
            Alert.alert("Hata", "JSON yedeği oluşturulamadı.");
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loading}>
                <ActivityIndicator color={colors.primary} size="large" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.eyebrow}>ABONELİKLERİM</Text>
                    <Text style={styles.title}>Kontrol sende.</Text>
                </View>
                <Pressable
                    accessibilityLabel="JSON yedeği oluştur"
                    onPress={exportBackup}
                    style={styles.backupButton}
                >
                    <Text style={styles.backupIcon}>↓</Text>
                    <Text style={styles.backupText}>Yedekle</Text>
                </Pressable>
            </View>

            <FlatList
                contentContainerStyle={styles.content}
                data={subscriptions}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <View>
                        <View style={styles.summaryGrid}>
                            <SummaryCard
                                label="Aylık toplam"
                                value={formatPrice(summary.monthlyTotal, "TRY")}
                                icon="₺"
                            />
                            <SummaryCard
                                label="Yaklaşan"
                                value={`${summary.upcoming.length} ödeme`}
                                icon="◷"
                                tone="orange"
                            />
                            <SummaryCard
                                label="Ödenen"
                                value={`${summary.paid.length} abonelik`}
                                icon="✓"
                                tone="green"
                            />
                        </View>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>
                                Tüm abonelikler
                            </Text>
                            <Text style={styles.count}>
                                {subscriptions.length}
                            </Text>
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>＋</Text>
                        <Text style={styles.emptyTitle}>
                            Henüz abonelik yok
                        </Text>
                        <Text style={styles.emptyText}>
                            Ödemelerini tek yerde görmek için ilk aboneliğini
                            ekle.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <SubscriptionCard
                        item={item}
                        onDelete={removeSubscription}
                        onTogglePaid={togglePaid}
                    />
                )}
                showsVerticalScrollIndicator={false}
            />

            <Pressable onPress={() => setModalVisible(true)} style={styles.fab}>
                <Text style={styles.fabPlus}>＋</Text>
                <Text style={styles.fabText}>Abonelik ekle</Text>
            </Pressable>

            <Modal
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
                transparent
                visible={modalVisible}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>
                                    Yeni abonelik
                                </Text>
                                <Text style={styles.modalSubtitle}>
                                    Ödeme bilgilerini ekle
                                </Text>
                            </View>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text style={styles.close}>×</Text>
                            </Pressable>
                        </View>
                        <ScrollView keyboardShouldPersistTaps="handled">
                            <Field
                                label="Abonelik adı"
                                placeholder="Örn. Netflix"
                                value={form.name}
                                onChangeText={(name) =>
                                    setForm({ ...form, name })
                                }
                            />
                            <View style={styles.row}>
                                <View style={styles.flex}>
                                    <Field
                                        label="Fiyat"
                                        keyboardType="decimal-pad"
                                        placeholder="0,00"
                                        value={form.price}
                                        onChangeText={(price) =>
                                            setForm({ ...form, price })
                                        }
                                    />
                                </View>
                                <View style={styles.currency}>
                                    <Field
                                        label="Para birimi"
                                        autoCapitalize="characters"
                                        placeholder="TRY"
                                        value={form.currency}
                                        onChangeText={(currency) =>
                                            setForm({ ...form, currency })
                                        }
                                    />
                                </View>
                            </View>
                            <Pressable
                                onPress={() => setDatePickerVisible(true)}
                                style={styles.dateField}
                            >
                                <Text style={styles.fieldLabel}>
                                    Sonraki ödeme
                                </Text>
                                <Text
                                    style={
                                        form.dueDate
                                            ? styles.dateValue
                                            : styles.datePlaceholder
                                    }
                                >
                                    {form.dueDate
                                        ? formatDate(form.dueDate)
                                        : "Gün / Ay / Yıl seçin"}
                                </Text>
                            </Pressable>
                            {datePickerVisible && (
                                <DateTimePicker
                                    value={
                                        form.dueDate
                                            ? new Date(
                                                  `${form.dueDate}T12:00:00`,
                                              )
                                            : new Date()
                                    }
                                    mode="date"
                                    display={
                                        Platform.OS === "ios"
                                            ? "inline"
                                            : "calendar"
                                    }
                                    minimumDate={new Date()}
                                    onChange={(
                                        event: DateTimePickerEvent,
                                        selectedDate?: Date,
                                    ) => {
                                        if (Platform.OS !== "ios")
                                            setDatePickerVisible(false);
                                        if (
                                            event.type === "set" &&
                                            selectedDate
                                        ) {
                                            const year =
                                                selectedDate.getFullYear();
                                            const month = String(
                                                selectedDate.getMonth() + 1,
                                            ).padStart(2, "0");
                                            const day = String(
                                                selectedDate.getDate(),
                                            ).padStart(2, "0");
                                            setForm({
                                                ...form,
                                                dueDate: `${year}-${month}-${day}`,
                                            });
                                        }
                                    }}
                                    style={styles.datePicker}
                                />
                            )}
                            <Field
                                label="Kategori"
                                placeholder="Genel"
                                value={form.category}
                                onChangeText={(category) =>
                                    setForm({ ...form, category })
                                }
                            />
                            <Pressable
                                onPress={addSubscription}
                                style={styles.saveButton}
                            >
                                <Text style={styles.saveButtonText}>
                                    Aboneliği kaydet
                                </Text>
                            </Pressable>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

function SummaryCard({
    label,
    value,
    icon,
    tone = "purple",
}: {
    label: string;
    value: string;
    icon: string;
    tone?: "purple" | "orange" | "green";
}) {
    return (
        <View style={styles.summaryCard}>
            <View
                style={[
                    styles.summaryIcon,
                    tone === "orange" && styles.orangeIcon,
                    tone === "green" && styles.greenIcon,
                ]}
            >
                <Text style={styles.summaryIconText}>{icon}</Text>
            </View>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text numberOfLines={1} style={styles.summaryValue}>
                {value}
            </Text>
        </View>
    );
}

function SubscriptionCard({
    item,
    onDelete,
    onTogglePaid,
}: {
    item: Subscription;
    onDelete: (item: Subscription) => void;
    onTogglePaid: (id: string) => void;
}) {
    const remaining = daysUntil(item.dueDate);
    const isSoon = !item.paid && remaining >= 0 && remaining <= 7;
    const missed = !item.paid && remaining < 0;
    const status = item.paid
        ? "ÖDENDİ"
        : missed
          ? "KAÇIRILDI"
          : isSoon
            ? remaining === 0
                ? "BUGÜN"
                : `${remaining} GÜN KALDI`
            : "AKTİF";
    const showPayButton = !item.paid && remaining === 0;
    return (
        <Pressable
            onLongPress={() => onDelete(item)}
            style={styles.subscriptionCard}
        >
            <View style={styles.cardTop}>
                <View style={styles.logo}>
                    <Text style={styles.logoText}>
                        {item.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View style={styles.cardInfo}>
                    <Text style={styles.subscriptionName}>{item.name}</Text>
                    <Text style={styles.category}>
                        {item.category} · {formatDate(item.dueDate)}
                    </Text>
                </View>
            </View>
            <View style={styles.cardBottom}>
                <Text style={styles.price}>
                    {formatPrice(item.price, item.currency)}
                </Text>
                {showPayButton ? (
                    <Pressable
                        onPress={() => onTogglePaid(item.id)}
                        style={[styles.status, styles.soonStatus]}
                    >
                        <Text style={[styles.statusText, styles.soonText]}>
                            ÖDEDİM
                        </Text>
                    </Pressable>
                ) : (
                    <View
                        style={[
                            styles.status,
                            item.paid && styles.paidStatus,
                            missed && styles.missedStatus,
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                item.paid && styles.paidText,
                                missed && styles.missedText,
                            ]}
                        >
                            {status}
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

function Field({
    label,
    ...props
}: { label: string } & React.ComponentProps<typeof TextInput>) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
                {...props}
                placeholderTextColor="#A0A7B5"
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 20,
    },
    eyebrow: {
        color: colors.primary,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 1.6,
    },
    title: { color: colors.ink, fontSize: 29, fontWeight: "800", marginTop: 5 },
    backupButton: {
        alignItems: "center",
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 14,
        borderWidth: 1,
        flexDirection: "row",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 9,
    },
    backupIcon: { color: colors.primary, fontSize: 20, fontWeight: "700" },
    backupText: { color: colors.ink, fontSize: 12, fontWeight: "700" },
    content: { paddingBottom: 110, paddingHorizontal: 20 },
    summaryGrid: { flexDirection: "row", gap: 9, marginBottom: 28 },
    summaryCard: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 17,
        borderWidth: 1,
        flex: 1,
        minHeight: 123,
        padding: 12,
    },
    summaryIcon: {
        alignItems: "center",
        backgroundColor: colors.primarySoft,
        borderRadius: 9,
        height: 28,
        justifyContent: "center",
        marginBottom: 11,
        width: 28,
    },
    orangeIcon: { backgroundColor: colors.orangeSoft },
    greenIcon: { backgroundColor: colors.greenSoft },
    summaryIconText: { color: colors.primary, fontSize: 16, fontWeight: "800" },
    summaryLabel: { color: colors.muted, fontSize: 11, marginBottom: 4 },
    summaryValue: { color: colors.ink, fontSize: 14, fontWeight: "800" },
    sectionHeader: {
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: { color: colors.ink, fontSize: 19, fontWeight: "800" },
    count: {
        backgroundColor: colors.primarySoft,
        borderRadius: 10,
        color: colors.primary,
        fontSize: 12,
        fontWeight: "800",
        overflow: "hidden",
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    subscriptionCard: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 18,
        borderWidth: 1,
        marginBottom: 11,
        padding: 15,
    },
    cardTop: { alignItems: "center", flexDirection: "row" },
    logo: {
        alignItems: "center",
        backgroundColor: colors.primarySoft,
        borderRadius: 13,
        height: 44,
        justifyContent: "center",
        width: 44,
    },
    logoText: { color: colors.primary, fontSize: 19, fontWeight: "800" },
    cardInfo: { flex: 1, marginLeft: 12 },
    subscriptionName: { color: colors.ink, fontSize: 16, fontWeight: "800" },
    category: { color: colors.muted, fontSize: 12, marginTop: 4 },
    cardBottom: {
        alignItems: "center",
        borderTopColor: colors.border,
        borderTopWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        paddingTop: 12,
    },
    price: { color: colors.ink, fontSize: 16, fontWeight: "800" },
    status: {
        backgroundColor: "#EEF0F4",
        borderRadius: 9,
        paddingHorizontal: 9,
        paddingVertical: 6,
    },
    paidStatus: { backgroundColor: colors.greenSoft },
    soonStatus: { backgroundColor: colors.orangeSoft },
    missedStatus: { backgroundColor: "#FDE8E8" },
    statusText: { color: colors.muted, fontSize: 10, fontWeight: "800" },
    paidText: { color: colors.green },
    soonText: { color: colors.orange },
    missedText: { color: colors.red },
    emptyState: {
        alignItems: "center",
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 18,
        borderStyle: "dashed",
        borderWidth: 1,
        padding: 30,
    },
    emptyIcon: { color: colors.primary, fontSize: 30 },
    emptyTitle: {
        color: colors.ink,
        fontSize: 16,
        fontWeight: "800",
        marginTop: 8,
    },
    emptyText: {
        color: colors.muted,
        fontSize: 13,
        lineHeight: 19,
        marginTop: 6,
        textAlign: "center",
    },
    fab: {
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: colors.primary,
        borderRadius: 27,
        bottom: 22,
        elevation: 5,
        flexDirection: "row",
        gap: 5,
        paddingHorizontal: 18,
        paddingVertical: 14,
        position: "absolute",
        shadowColor: "#413AC8",
        shadowOffset: { height: 5, width: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    fabPlus: { color: "#FFFFFF", fontSize: 20, fontWeight: "400" },
    fabText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
    modalOverlay: {
        backgroundColor: "rgba(17, 24, 39, 0.45)",
        flex: 1,
        justifyContent: "flex-end",
    },
    modalCard: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 26,
        borderTopRightRadius: 26,
        maxHeight: "90%",
        padding: 22,
    },
    modalHeader: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 22,
    },
    modalTitle: { color: colors.ink, fontSize: 23, fontWeight: "800" },
    modalSubtitle: { color: colors.muted, fontSize: 13, marginTop: 4 },
    close: { color: colors.muted, fontSize: 32, fontWeight: "300" },
    field: { marginBottom: 15 },
    fieldLabel: {
        color: colors.ink,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 7,
    },
    input: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 12,
        borderWidth: 1,
        color: colors.ink,
        fontSize: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    dateField: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    dateValue: { color: colors.ink, fontSize: 15 },
    datePlaceholder: { color: "#A0A7B5", fontSize: 15 },
    datePicker: { alignSelf: "center", marginBottom: 12 },
    row: { flexDirection: "row", gap: 10 },
    flex: { flex: 1 },
    currency: { width: 105 },
    saveButton: {
        alignItems: "center",
        backgroundColor: colors.primary,
        borderRadius: 13,
        marginTop: 5,
        paddingVertical: 15,
    },
    saveButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
});
