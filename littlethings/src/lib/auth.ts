import User from "@/models/user";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/conntectDB";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Enter your email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password",
                },
            },
            authorize: async (credentials) => {
                if (!credentials.email || !credentials.password) {
                    throw new Error("Email and password are required");
                }
                try {
                    await connectDB();
                    const user = await User.findOne({
                        email: credentials.email,
                        provider: "credentials",
                    });
                    if (
                        user &&
                        (await bcrypt.compare(
                            credentials.password as string,
                            user.password
                        ))
                    ) {
                        return user;
                    } else {
                        throw new Error("Email or password is incorrect");
                    }
                } catch (error) {
                    throw new Error("Failed to login" + error);
                }
            },
        }),
        GitHub,
        Google,
    ],
    callbacks: {
        async signIn({ account, profile }) {
            try {
                await connectDB();
                if (account?.provider === "github") {
                    if (!profile?.email) {
                        throw new Error(
                            "GitHub profile does not provide an email"
                        );
                    }
                    const existingUser = await User.findOne({
                        email: profile.email,
                    });
                    if (!existingUser) {
                        await User.create({
                            email: profile.email,
                            username: profile.login,
                            avatar: profile.avatar_url,
                            provider: "github",
                        });
                    }
                }
                if (account?.provider === "google") {
                    if (!profile?.email) {
                        throw new Error(
                            "Google profile does not provide an email"
                        );
                    }
                    const existingUser = await User.findOne({
                        email: profile.email,
                    });
                    if (!existingUser) {
                        await User.create({
                            email: profile.email,
                            username: profile.login,
                            avatar: profile.avatar_url,
                            provider: "google",
                        });
                    }
                }
                return true;
            } catch {
                throw new Error("Failed to sign in");
            }
        },
    },
    secret: process.env.AUTH_SECRET,
});
