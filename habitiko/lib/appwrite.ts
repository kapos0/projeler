import * as AppwriteWeb from "appwrite";
import { Platform } from "react-native";
import * as AppwriteRN from "react-native-appwrite";
//this file is used to initialize the Appwrite SDK for both web and React Native environments
//for realtime updates, we use the same client for both web and React Native
//we use the same environment variables for both web and React Native
function getAppwriteInstances() {
    if (Platform.OS === "web") {
        const client = new AppwriteWeb.Client()
            .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);
        return {
            client,
            account: new AppwriteWeb.Account(client),
            databases: new AppwriteWeb.Databases(client),
        };
    } else {
        const client = new AppwriteRN.Client()
            .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);
        return {
            client,
            account: new AppwriteRN.Account(client),
            databases: new AppwriteRN.Databases(client),
        };
    }
}

const { client, account, databases } = getAppwriteInstances();

export { account, client, databases };

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!;
export const HABITS_COLLECTION_ID =
    process.env.EXPO_PUBLIC_HABITS_COLLECTION_ID!;
export const COMPLETIONS_COLLECTION_ID =
    process.env.EXPO_PUBLIC_COMPLETIONS_COLLECTION_ID!;

export interface RealtimeResponse {
    events: string[];
    payload: unknown;
}
