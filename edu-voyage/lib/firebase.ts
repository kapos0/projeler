import { Platform } from "react-native";
import { initializeApp, getApps } from "firebase/app";
import {
    initializeAuth,
    getAuth,
    getReactNativePersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIRABASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIRABASE_AUTH_DOMAIN!,
    projectId: process.env.EXPO_PUBLIC_FIRABASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIRABASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIRABASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIRABASE_APP_ID!,
    measurementId: process.env.EXPO_PUBLIC_FIRABASE_MEASUREMENT_ID!,
};

if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId ||
    !firebaseConfig.storageBucket ||
    !firebaseConfig.messagingSenderId ||
    !firebaseConfig.appId ||
    !firebaseConfig.measurementId
)
    throw new Error("Firebase config is not set");

let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    if (Platform.OS === "web")
        initializeAuth(app, {
            persistence: browserLocalPersistence,
        });
    else
        initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
} else app = getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
