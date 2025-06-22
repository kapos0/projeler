import { Client, Databases, Account } from "react-native-appwrite";
import { Platform } from "react-native";

const config = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    collections: {
        notesCollection: process.env.EXPO_PUBLIC_APPWRITE_NOTES_COLLECTION_ID!,
    },
};

const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId);

switch (Platform.OS) {
    case "ios":
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_BUNDLE_NAME!);
        break;
    case "android":
        client.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PACKAGE_NAME!);
        break;
    default:
        throw new Error("Unsupported platform");
}

const database = new Databases(client);
const account = new Account(client);

export { database, config, client, account };
