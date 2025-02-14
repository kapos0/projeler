"use server";
import { connectDB } from "@/lib/conntectDB";
import User from "@/models/user";

export async function deleteUserAction(userEmail: string) {
    try {
        await connectDB();
        const existingUser = await User.findOne({
            email: userEmail,
        });
        if (!existingUser) return { message: "User not found" };
        await existingUser.remove();
        return { message: "User deleted successfully" };
    } catch {
        return { message: "An error occurred while deleting user" };
    }
}
