"use server";

import { connectDB } from "@/lib/conntectDB";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function createUserAction(formData: FormData) {
    try {
        await connectDB();
        if (
            !formData.get("email") ||
            !formData.get("password") ||
            !formData.get("username")
        ) {
            return { message: "Email, password and user name are required" };
        }
        const existingUser = await User.findOne({
            email: formData.get("email") as string,
        });
        if (existingUser) return { message: "User already exists" };
        const hashedPassword = await bcrypt.hash(
            formData.get("password") as string,
            10
        );
        const user = new User({
            email: formData.get("email") as string,
            avatar: "https://plus.unsplash.com/premium_photo-1722018576685-45a415a4ff67?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            provider: "credentials",
            username: formData.get("username") as string,
            favs: [],
            password: hashedPassword,
        });
        await user.save();
        return { message: "User created successfully" };
    } catch {
        throw new Error("Failed to create user");
    }
}
