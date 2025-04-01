import { createContext } from "react";

export type userType = {
    username: string;
    email: string;
    password: string;
    uid: string;
    member: boolean;
};

type UserContextType = {
    user: userType | null;
    setUser: (user: userType | null) => void;
};

export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
});
