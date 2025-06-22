import { ID, Query } from "react-native-appwrite";
import databaseService from "@/services/databaseService";
import { config } from "@/services/appwrite";

const dbId = config.databaseId;
const collectionId = config.collections.notesCollection;

const notesService = {
    async getNotes(userId: string) {
        if (!userId) {
            console.error("Error: Missing userId in getNotes()");
            return {
                data: [],
                error: "User ID is missing",
            };
        }

        try {
            const response = await databaseService.listDocuments(
                dbId,
                collectionId,
                [Query.equal("user_id", userId)]
            );
            return response;
        } catch (error) {
            console.error("Error fetching notes:", (error as any).message);
            return { data: [], error: (error as any).message };
        }
    },
    async addNewNote(content: string, userId: string) {
        if (!content) return { error: "Content is required" };
        const data = {
            content: content,
            createdAt: new Date().toISOString(),
            user_id: userId,
        };
        const response = await databaseService.createDocument(
            dbId,
            collectionId,
            data,
            ID.unique()
        );
        if (response?.error) return { error: response.error };
        return { data: response };
    },
    async updateNote(noteId: string, content: string) {
        const response = await databaseService.updateDocument(
            dbId,
            collectionId,
            noteId,
            {
                content: content,
            }
        );
        if (response?.error) return { error: response.error };
        return { data: response };
    },
    async deleteNote(noteId: string) {
        if (!noteId) return { error: "Note ID is required" };
        const response = await databaseService.deteleDocument(
            dbId,
            collectionId,
            noteId
        );
        if (response?.error) return { success: false, error: response.error };
        return { success: true };
    },
};

export default notesService;
