"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type propTypes = {
    movieId: number;
    title: string;
    image: string;
    overview: string;
    releaseDate: string;
    voteCount: number;
};

export default function AddToFav({
    movieId,
    title,
    image,
    overview,
    releaseDate,
    voteCount,
}: propTypes) {
    const [isFav, setIsFav] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const session = useSession();
    const router = useRouter();

    async function handleFavClick(action: "add" | "remove") {
        setIsLoading(true);

        if (!session.data?.user) {
            setIsLoading(false);
            router.push("/sign-in");
            return;
        }

        fetch("/api/addToFav", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action,
                userEmail: session.data.user.email,
                movieId,
                title,
                image,
                description: overview || "No description available",
                dateReleased: releaseDate,
                rating: voteCount,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (
                    action === "add" &&
                    data.message === "Added to favourites"
                ) {
                    setIsFav(true);
                    toast.success("Added to Favorites!");
                } else if (
                    action === "remove" &&
                    data.message === "Removed from favourites"
                ) {
                    setIsFav(false);
                    toast.success("Removed from Favorites!");
                } else {
                    toast.error(data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error(
                    "Failed to update favorites. Please refresh the page."
                );
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div>
            <button
                onClick={() => handleFavClick(isFav ? "remove" : "add")}
                className={`p-2 rounded ${
                    isFav
                        ? "bg-red-300 dark:bg-red-600"
                        : "bg-gray-300 dark:bg-gray-600"
                }`}
                disabled={isLoading}
            >
                {isLoading
                    ? "Loading..."
                    : isFav
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
            </button>
        </div>
    );
}
