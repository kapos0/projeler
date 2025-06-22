import { database } from "@/services/appwrite";

const databaseService = {
    async listDocuments(
        dbId: string,
        collectionId: string,
        queries = [] as string[]
    ) {
        try {
            const response = await database.listDocuments(
                dbId,
                collectionId,
                queries
            );
            return { data: response.documents || [], error: null };
        } catch (error) {
            console.error("Error fetching documents:", (error as any).message);
            return { error: (error as any).message };
        }
    },
    async createDocument<T extends object>(
        dbId: string,
        collectionId: string,
        data: T,
        id: string | null = null
    ) {
        try {
            return await database.createDocument(
                dbId,
                collectionId,
                id ?? "",
                data
            );
        } catch (error) {
            console.error("Error creating document:", (error as any).message);
            return { error: (error as any).message };
        }
    },
    async updateDocument<T extends object>(
        dbId: string,
        collectionId: string,
        documentId: string,
        data: T
    ) {
        try {
            return await database.updateDocument(
                dbId,
                collectionId,
                documentId,
                data
            );
        } catch (error) {
            console.error("Error updating document", (error as any).message);
            return { error: (error as any).message };
        }
    },
    async deteleDocument(
        dbId: string,
        collectionId: string,
        documentId: string
    ) {
        try {
            await database.deleteDocument(dbId, collectionId, documentId);
            return { success: true };
        } catch (error) {
            console.error("Error deleting document:", (error as any).message);
            return { error: (error as any).message };
        }
    },
};

export default databaseService;
