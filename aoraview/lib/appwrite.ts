import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
    ImageGravity,
} from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    storageId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
    mediaCollectionId: process.env.EXPO_PUBLIC_APPWRITE_MEDIAS_COLLECTION_ID!,
};

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function signIn(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );
        return session;
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function createUser(
    email: string,
    password: string,
    username: string
): Promise<any> {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) {
            throw new Error("Failed to create account");
        }
        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(), // Document ID
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        console.error("Error in createUser:", error);
        throw new Error(String(error));
    }
}

export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function getUserFavs() {
    try {
        const currentAccount = await getCurrentUser();
        if (!currentAccount) throw new Error("No current account found");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", currentAccount.$id)]
        );
        if (!currentUser || currentUser.documents.length === 0)
            throw new Error("No current user found");

        return currentUser.documents[0].fav_medias || [];
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function addFavMedia(mediaId: string) {
    try {
        const currentAccount = await getCurrentUser();
        if (!currentAccount) throw new Error("No current account found");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", currentAccount.$id)]
        );
        if (!currentUser || currentUser.documents.length === 0)
            throw new Error("No current user found");

        const favMedias = currentUser.documents[0].fav_medias || [];
        favMedias.push(mediaId);

        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUser.documents[0].$id,
            {
                fav_medias: favMedias,
            }
        );
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function removeFavMedia(mediaId: string) {
    if (!mediaId) return;
    try {
        const currentAccount = await getCurrentUser();
        if (!currentAccount) throw new Error("No current account found");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("$id", currentAccount.$id)]
        );
        if (!currentUser || currentUser.documents.length === 0)
            throw new Error("No current user found");

        const favMedias = currentUser.documents[0].fav_medias || [];
        const updatedFavMedias = favMedias.filter((item: any) => {
            return item.$id !== mediaId;
        });

        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUser.documents[0].$id,
            {
                fav_medias: updatedFavMedias,
            }
        );
    } catch (error) {
        throw new Error(String(error));
    }
}

export const checkSession = async (): Promise<boolean> => {
    try {
        const session = await account.get();
        return !!session;
    } catch {
        return false;
    }
};

export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function signOut() {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function uploadFile(file: any, type: string) {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);
        return fileUrl;
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function getFilePreview(fileId: string, type: string) {
    let fileUrl;

    try {
        if (type === "media") {
            fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                2000,
                100,
                ImageGravity.Top
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(String(error));
    }
}

type MediaPostForm = {
    title: string;
    thumbnail: any;
    media: any;
    content: string;
    userId: string;
};

export async function createMediaPost(form: MediaPostForm) {
    try {
        const [thumbnailUrl, mediaUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.media, "media"),
        ]);

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.mediaCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                media: mediaUrl,
                content: form.content,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.mediaCollectionId
        );

        return posts.documents;
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function getUserPosts(userId: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.mediaCollectionId,
            [Query.equal("creator", userId)]
        );

        return posts.documents;
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function searchPosts(query: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.mediaCollectionId,
            [Query.search("title", query)]
        );
        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error) {
        throw new Error(String(error));
    }
}

export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.mediaCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );
        return posts.documents;
    } catch (error) {
        throw new Error(String(error));
    }
}
