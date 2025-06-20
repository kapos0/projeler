import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
    user: Models.User<Models.Preferences> | null;
    isLoadingUser: boolean;
    signUp: (email: string, password: string) => Promise<string | null>;
    signIn: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
        null
    );

    const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        try {
            const session = await account.get();
            if (!session) {
                setUser(null);
                return;
            }
            setUser(session);
        } catch {
            setUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    }

    async function signUp(email: string, password: string) {
        try {
            await account.create(ID.unique(), email, password);
            await signIn(email, password);
            return null;
        } catch (error) {
            if (error instanceof Error) return error.message;
            return "An error occured during signup";
        }
    }
    async function signIn(email: string, password: string) {
        try {
            await account.createEmailPasswordSession(email, password);
            const session = await account.get();
            setUser(session);
            return null;
        } catch (error) {
            if (error instanceof Error) return error.message;
            return "An error occured during sign in";
        }
    }

    async function signOut() {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, isLoadingUser, signUp, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error("useAuth must be inside of the AuthProvider");
    return context;
}
