import NextAuth, { CredentialsSignin } from "next-auth";
import { connectDB } from "@/lib/conntectDB";
import User from "@/models/user";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";

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
                    accept: "credentials, google, github",
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
                });

                if (!user || !user.password)
                    throw new Error("Invalid username or password");

                const isMatched = await compare(password, user?.password);

                if (!isMatched) throw new Error("Password did not matched");
                return user;
            },
        }),
        Google,
        Github,
    ],
    pages: {
        signIn: "/sign-in",
        newUser: "/sign-up",
    },
    callbacks: {
        //when user sign in with google or github it needs to be saved in the database
        async signIn({ user, account }) {
            await connectDB();
            if (
                account?.provider === "google" ||
                account?.provider === "github"
            ) {
                const existingUser = await User.findOne({ email: user?.email });
                if (!existingUser) {
                    const newUser = new User({
                        email: user?.email,
                        username: user?.name,
                        provider: account?.provider,
                        image: user?.image,
                        website: "",
                        bio: "",
                        location: "",
                        posts: [],
                        notifications: [],
                        followers: [],
                        following: [],
                        isVerified: true,
                    });
                    await newUser.save();
                }
            }
            return true;
        },
    },
});
