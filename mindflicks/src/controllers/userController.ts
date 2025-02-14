/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { connectDB } from "@/lib/conntectDB";
import User from "@/models/user";
import { auth, signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function login(formData: FormData): Promise<any> {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    if (!username || !password) return "Please fill all fields";
    try {
        await signIn("credentials", {
            username,
            password,
        });
    } catch (error) {
        const someError = error as CredentialsSignin;
        return someError.cause;
    }
    revalidatePath("/");
    redirect("/");
}

async function register(formData: FormData): Promise<any> {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const provider = "credentials";
    if (!username || !email || !password) return "Please fill all fields";

    await connectDB();

    // existing user
    const existingUser = await User.findOne({ username });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await hash(password, 12);

    await User.create({
        username,
        provider,
        email,
        password: hashedPassword,
        bio: "",
        location: "",
        website: "",
        isVerified: false,
        posts: [],
        notifications: [],
        followers: [],
        following: [],
    });
    console.log(`User created successfully 🥂`);
    revalidatePath("/");
    redirect("/sign-in");
}

async function fetchAllUsers() {
    await connectDB();
    const users = await User.find({});
    return users;
}

async function fetchUser() {
    const user = await auth();
    if (!user) throw new Error("User not found");
    const userEmail = user.user?.email;
    await connectDB();
    const dbUser = await User.findOne({ email: userEmail });
    return dbUser;
}

async function getRandomUsers() {
    try {
        await connectDB();
        const user = await fetchUser();
        const randomUsers = await User.aggregate([
            {
                $match: {
                    _id: { $ne: user._id },
                    followers: { $not: { $elemMatch: { $eq: user._id } } },
                },
            },
            {
                $project: {
                    name: 1,
                    username: 1,
                    image: 1,
                    followersCount: { $size: "$followers" },
                },
            },
            { $sample: { size: 5 } },
        ]);

        return randomUsers;
    } catch (error) {
        console.error("Failed to get random users", error);
        return null;
    }
}

async function toggleFollow(targetUserId: string) {
    try {
        const authUser = await fetchUser();

        if (!authUser) throw new Error("Authentication required");

        if (authUser._id.toString() === targetUserId)
            throw new Error("You cannot follow yourself");

        const targetUser = await User.findById(targetUserId);

        if (!targetUser) throw new Error("Target user not found");

        const isFollowing = authUser.following.includes(targetUserId);

        if (isFollowing) {
            await User.findByIdAndUpdate(authUser._id, {
                $pull: { following: targetUserId },
            });

            await User.findByIdAndUpdate(targetUserId, {
                $pull: { followers: authUser._id },
            });
            await User.findByIdAndUpdate(targetUserId, {
                $pull: {
                    notifications: { creator: authUser._id, type: "FOLLOW" },
                },
            });
        } else {
            await User.findByIdAndUpdate(authUser._id, {
                $push: { following: targetUserId },
            });

            await User.findByIdAndUpdate(targetUserId, {
                $push: { followers: authUser._id },
            });

            await User.findByIdAndUpdate(targetUserId, {
                $push: {
                    notifications: {
                        creator: authUser._id,
                        type: "FOLLOW",
                        read: false,
                        createdAt: new Date(),
                    },
                },
            });
        }
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Error in toggleFollow:", error);
        return {
            success: false,
            error: (error as Error).message || "Error toggling follow",
        };
    }
}

export {
    register,
    login,
    fetchAllUsers,
    fetchUser,
    getRandomUsers,
    toggleFollow,
};
