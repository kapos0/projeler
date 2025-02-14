import { connectDB } from "@/lib/conntectDB";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            action, // either "add" or "remove"
            movieId,
            userEmail,
            title,
            description,
            dateReleased,
            rating,
            image,
        } = body;

        if (!movieId || !userEmail) {
            return NextResponse.json(
                { message: "Movie ID and email are required" },
                { status: 400 }
            );
        }

        await connectDB();

        if (action === "add") {
            if (!title || !description || !dateReleased || !rating || !image) {
                return NextResponse.json(
                    { message: "All movie details are required for addition" },
                    { status: 400 }
                );
            }

            const movie = {
                movieId,
                title,
                description,
                dateReleased: new Date(dateReleased),
                rating,
                image,
            };

            const user = await User.findOneAndUpdate(
                { email: userEmail, "favs.movieId": { $ne: movieId } },
                { $push: { favs: movie } },
                { new: true }
            );

            if (!user) {
                return NextResponse.json(
                    {
                        message:
                            "Movie is already in favourites or user not found",
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { message: "Added to favourites", user },
                { status: 200 }
            );
        } else if (action === "remove") {
            const user = await User.findOneAndUpdate(
                { email: userEmail },
                { $pull: { favs: { movieId } } },
                { new: true }
            );

            if (!user) {
                return NextResponse.json(
                    { message: "User not found or movie not in favourites" },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { message: "Removed from favourites", user },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { message: "Invalid action" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error managing favourites:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { message: "Something went wrong", error: errorMessage },
            { status: 500 }
        );
    }
}
