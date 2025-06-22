import {
    ReactNode,
    createContext,
    useContext,
    useState,
    useEffect,
} from "react";
import authService from "@/services/authService";

type AuthContextType = {
    user: unknown;
    login: (
        email: string,
        password: string
    ) => Promise<{ error?: any; succes?: boolean }>;
    register: (
        email: string,
        password: string
    ) => Promise<{ error?: any; succes?: boolean }>;
    logout: () => Promise<void>;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<unknown>(null);
    const [loading, setLoading] = useState(true);
    async function checkUser() {
        setLoading(true);
        const response = await authService.getUser();

        if (response) setUser(response);
        else setUser(null);

        setLoading(false);
    }
    useEffect(() => {
        checkUser();
    }, []);

    async function login(email: string, password: string) {
        setLoading(true);
        const response = await authService.login(email, password);
        if ("error" in response) {
            setUser(null);
            setLoading(false);
            return response;
        }

        await checkUser();
        setLoading(false);
        return { succes: true };
    }
    async function register(email: string, password: string) {
        setLoading(true);
        const response = await authService.register(email, password);

        if ("error" in response) {
            setLoading(false);
            return response;
        }

        setLoading(false);
        return login(email, password);
    }

    async function logout() {
        setLoading(true);
        await authService.logout();
        setUser(null);
        await checkUser();
        setLoading(false);
    }
    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;
