import { connectDB } from "@/lib/conntectDB";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Parse the query parameters to extract the userEmail
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get("userEmail");
        if (!userEmail) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectDB();

        // Fetch the user by email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Return the favorites list
        return NextResponse.json(
            {
                message: "Favorites retrieved successfully",
                favorites: user.favs,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving favorites:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: "Something went wrong", error: errorMessage },
            { status: 500 }
        );
    }
}
