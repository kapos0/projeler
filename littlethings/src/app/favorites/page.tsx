"use client";
import Results from "@/components/Results";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function FavoritesPage() {
    const session = useSession();
    const [results, setResults] = useState<any>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `/api/getAllFavorites?userEmail=${session.data?.user?.email}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (res.ok) {
                    const data = await res.json();
                    setResults(data.favorites);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };
        if (session.data?.user?.email) {
            fetchData();
        }
    }, [session]);
    if (!session?.data?.user?.email) {
        return (
            <div className="text-center mt-10">
                <h1 className="text-xl my-5">
                    Please sign in to view your favorites
                </h1>
            </div>
        );
    }
    return (
        <div>
            {!results ||
                (results.length === 0 && (
                    <h1 className="text-center pt-6">No results found</h1>
                ))}
            {results && results.length !== 0 && (
                <Results
                    results={results.map((result: any) => ({
                        ...result,
                        id: result.movieId,
                        title: result.title,
                        backdrop_path: result.image,
                        overview: result.description,
                        first_air_date: result.dateReleased.substring(0, 10),
                        vote_count: result.rating,
                    }))}
                />
            )}
        </div>
    );
}
