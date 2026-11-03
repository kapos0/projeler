import AsyncStorage from "@react-native-async-storage/async-storage";

import { Subscription } from "@/types/subscription";

const STORAGE_KEY = "@subscription-tracker/subscriptions";

export async function loadSubscriptions(): Promise<Subscription[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) return [];
  return parsed as Subscription[];
}

export function saveSubscriptions(subscriptions: Subscription[]) {
  return AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
}
