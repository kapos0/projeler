"use server";

import { connectDB } from "@/lib/connectDB";
import User from "@/models/UserModel";
import { auth, signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function login(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    if (!username || !password) return "Please fill all fields";
    try {
        await signIn("credentials", {
            redirect: false,
            callbackUrl: "/",
            username,
            password,
        });
        revalidatePath("/");
        return;
    } catch (error) {
        const someError = error as CredentialsSignin;
        return someError.cause;
    }
}

async function fastLogin(service: "google") {
    try {
        await signIn(service, { callbackUrl: "/" });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to login");
    }
}

async function register(formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const avatar_url = formData.get("avatar_url") as string;
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
        avatar: avatar_url,
    });
    console.log(`User created successfully 🥂`);
    revalidatePath("/");
    redirect("/sign-in");
}

async function fetchAllUsers() {
    await connectDB();
    const plainUsers = await User.find({}).sort({ createdAt: -1 });
    const users = plainUsers.map((user) => user.toObject());
    const forClientPosts = users.map((user) => ({
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
    }));
    return forClientPosts;
}

async function fetchRecentUsers() {
    await connectDB();
    const plainUsers = await User.find({}).sort({ createdAt: -1 }).limit(5);
    const users = plainUsers.map((user) => user.toObject());
    const forClientUsers = users.map((user) => ({
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
    }));
    return forClientUsers;
}

async function fetchUser() {
    const user = await auth();
    if (!user) throw new Error("User not found");
    const userEmail = user.user?.email;
    await connectDB();
    const dbUser = await User.findOne({ email: userEmail });
    return dbUser;
}

async function updateUser(formData: FormData) {
    try {
        const user = await auth();
        if (!user) throw new Error("User not found");

        const username = formData.get("username") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const avatar_url = formData.get("avatar") as string;

        await connectDB();

        const db_user = await User.findOne({ email: user.user?.email });
        if (!db_user) throw new Error("User not found");

        const hashedPassword = password
            ? await hash(password, 12)
            : db_user.password;

        await User.findByIdAndUpdate(db_user._id, {
            username,
            email,
            password: hashedPassword,
            ...(avatar_url && { avatar: avatar_url }),
        });
        console.log("User updated successfully 🥂");
        revalidatePath("/");
        return;
    } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
    }
}

async function deleteUser(_id: string) {
    if (!_id) throw new Error("Please provide a valid user ID");
    try {
        await connectDB();
        await User.findByIdAndDelete(_id);
        revalidatePath("/");
        return;
    } catch (error) {
        console.error("Error deleting user:", error);
    }
}

export {
    fastLogin,
    register,
    login,
    fetchRecentUsers,
    fetchAllUsers,
    fetchUser,
    updateUser,
    deleteUser,
};
