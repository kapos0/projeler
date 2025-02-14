"use server";
import User from "@/models/user";
import { fetchUser } from "./userController";
import { revalidatePath } from "next/cache";
import Post from "@/models/post";

export async function getProfileByUsername(username: string) {
    try {
        const user = await User.findOne({ username });
        if (!user) return null;
        const plainUser = JSON.parse(JSON.stringify(user));
        return plainUser;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw new Error("Failed to fetch profile");
    }
}

export async function getPostsByAuthor(authorId: string) {
    try {
        const posts = await Post.find({ author: authorId }).lean();
        const plainPosts = JSON.parse(JSON.stringify(posts));
        return plainPosts;
    } catch (error) {
        console.error("Error fetching posts by author:", error);
        throw new Error("Failed to fetch posts");
    }
}

export async function updateProfile(formData: FormData) {
    try {
        const authUser = await fetchUser();
        const userId = authUser?._id;
        if (!userId) throw new Error("Unauthorized");

        const username = formData.get("username") as string;
        const bio = formData.get("bio") as string;
        const location = formData.get("location") as string;
        const website = formData.get("website") as string;

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { username, bio, location, website },
            { new: true }
        );

        if (!user) throw new Error("User not found");

        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function isFollowing(userId: string) {
    try {
        const dbUserId = await fetchUser();
        const currentUserId = dbUserId?._id;
        if (!currentUserId) return false;

        const user = await User.findById(currentUserId);
        if (!user) return false;

        const isFollowing = user.following.includes(userId);

        return isFollowing ? true : false;
    } catch (error) {
        console.error("Error checking follow status:", error);
        return false;
    }
}
