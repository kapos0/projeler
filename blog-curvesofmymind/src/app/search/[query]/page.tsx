"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "@/components/PostCard";
import PostFilter from "@/components/PostFilter";
import { PostType } from "@/models/PostModel";
import { getPosts, getPostsByQuery } from "@/actions/PostAction";

export default function SearchPage({
    params: paramsPromise,
}: {
    params: Promise<{ query: string }>;
}) {
    const params = React.use(paramsPromise);
    const searchQuery = String(params.query).replace(/%20/g, " "); // Decode URL-encoded spaces

    const [sidebarData, setSidebarData] = useState({
        searchTerm: searchQuery === "*" ? "" : searchQuery,
        category: searchQuery === "*" ? "" : "uncategorized",
    });
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const data = searchQuery
                ? await getPostsByQuery(
                      sidebarData.searchTerm,
                      sidebarData.category
                  )
                : await getPosts();
            if (data) setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, sidebarData]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    async function handleFilterChange(newData: {
        searchTerm: string;
        category: string;
    }) {
        setSidebarData(newData);
        setLoading(true);
        try {
            await fetchPosts();
            const filtered = posts.filter((post) => {
                const matchesSearch = post.title
                    .toLowerCase()
                    .includes(newData.searchTerm.toLowerCase());
                const matchesCategory =
                    newData.category === "uncategorized" ||
                    post.category === newData.category;
                return matchesSearch && matchesCategory;
            });
            setPosts(filtered);
        } catch (error) {
            console.error("Error handling filter change:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <PostFilter
                sidebarData={sidebarData}
                onFilterChange={handleFilterChange}
            />

            <div className="flex-1">
                <h1 className="text-3xl font-semibold border-b border-border p-4 md:p-6">
                    Posts results
                </h1>

                <div className="p-4 md:p-6">
                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="h-[200px] w-full rounded-lg" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-3 w-1/2" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && posts.length === 0 && (
                        <p className="text-xl text-muted-foreground py-8 text-center">
                            No posts found.
                        </p>
                    )}

                    {!loading && posts.length > 0 && (
                        <div className="flex flex-row gap-2 flex-wrap align-center justify-center">
                            {posts.map((post) => (
                                <div key={post._id}>
                                    <PostCard post={post} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
