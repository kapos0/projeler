import { account } from "@/services/appwrite";
import { ID } from "react-native-appwrite";

const authService = {
    async register(email: string, password: string) {
        try {
            const response = await account.create(ID.unique(), email, password);
            return response;
        } catch (error) {
            return {
                error:
                    (error as any).message ||
                    "An error occurred while registering",
            };
        }
    },
    async login(email: string, password: string) {
        try {
            const response = await account.createEmailPasswordSession(
                email,
                password
            );
            return response;
        } catch (error) {
            return {
                error:
                    (error as any).message ||
                    "An error occurred while logging in please check your credentials",
            };
        }
    },

    async getUser() {
        try {
            return await account.get();
        } catch {
            return null;
        }
    },

    async logout() {
        try {
            await account.deleteSession("current");
        } catch (error) {
            return {
                error:
                    (error as any).message || "Logout failed. Please try again",
            };
        }
    },
};

export default authService;
