import NextAuth, { CredentialsSignin } from "next-auth";
import { connectDB } from "@/lib/connectDB";
import User from "@/models/UserModel";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import Google from "next-auth/providers/google";

import "next-auth";

declare module "next-auth" {
    interface User {
        id?: string;
        username?: string;
        role?: string;
        isVerified?: boolean;
        avatar?: string;
        provider?: string;
    }

    interface Session {
        user: {
            id?: string;
            username?: string;
            email?: string;
            role?: string;
            isVerified?: boolean;
            avatar?: string;
            provider?: string;
        };
    }
}

declare module "next-auth" {
    interface JWT {
        id?: string;
        username?: string;
        role?: string;
        isVerified?: boolean;
        avatar?: string;
        provider?: string;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
                username: {
                    label: "Username",
                    type: "text",
                    placeholder: "Username",
                },
                provider: {
                    type: "hidden",
                    accept: "credentials, google",
                },
                avatar: {
                    type: "text",
                },
                role: {
                    type: "hidden",
                    defaultValue: "user",
                },
            },
            authorize: async (credentials) => {
                const username = credentials.username as string | undefined;
                const password = credentials.password as string | undefined;

                if (!username || !password)
                    throw new CredentialsSignin(
                        "Please provide both username & password"
                    );
                await connectDB();
                const user = await User.findOne({
                    username,
                    provider: "credentials",
                }).select("+password +role");

                if (!user || !user.password)
                    throw new Error("Invalid username or password");

                const isMatched = await compare(password, user?.password);

                if (!isMatched) throw new Error("Password did not matched");

                const userData = {
                    username: user?.username,
                    email: user?.email,
                    role: user?.role,
                    id: user?._id,
                    isVerified: user?.isVerified,
                    avatar: user?.avatar,
                    provider: user?.provider,
                };
                return userData;
            },
        }),
        Google,
    ],
    pages: {
        signIn: "/sign-in",
        newUser: "/sign-up",
    },
    callbacks: {
        //when user sign in with google or github it needs to be saved in the database
        async signIn({ user, account }) {
            await connectDB();
            if (account?.provider === "google") {
                const existingUser = await User.findOne({ email: user?.email });
                if (!existingUser) {
                    const newUser = new User({
                        email: user?.email,
                        username: user?.name,
                        provider: account?.provider,
                        avatar: user?.image,
                        isVerified: true,
                    });
                    await newUser.save();
                }
            }
            return true;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id as string,
                username: token.username as string,
                email: token.email as string,
                role: token.role as string,
                isVerified: token.isVerified as boolean,
                avatar: token.avatar as string,
                provider: token.provider as string,
            };
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.username = user.username ?? "";
                token.email = user.email ?? "";
                token.role = user.role ?? "user";
                token.isVerified = user.isVerified ?? false;
                token.avatar = user.avatar ?? "";
                token.provider = user.provider ?? "credentials";
            }
            return token;
        },
    },
});
