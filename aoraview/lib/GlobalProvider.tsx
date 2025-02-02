import React, { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, checkSession } from "@/lib/appwrite";

type GlobalContextType = {
    isLogged: boolean;
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    loading: boolean;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error(
            "useGlobalContext must be used within a GlobalProvider"
        );
    }
    return context;
};

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isLogged, setIsLogged] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            try {
                const session = await checkSession(); // Oturum kontrolü
                if (session) {
                    const userData = await getCurrentUser();
                    setIsLogged(true);
                    setUser(userData);
                } else {
                    setIsLogged(false);
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth error:", error);
                setIsLogged(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    return (
        <GlobalContext.Provider
            value={{ isLogged, setIsLogged, user, setUser, loading }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
