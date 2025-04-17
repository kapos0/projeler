"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getPostById } from "@/actions/PostAction";
import { PostType } from "@/models/PostModel";
import RecentPosts from "@/components/RecentPosts";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";

function PostPage({
    params: paramsPromise,
}: {
    params: Promise<{ postId: string }>;
}) {
    const params = React.use(paramsPromise);
    const postId = params.postId;
    const [post, setPost] = useState<PostType | null>(null);

    useEffect(() => {
        async function getPost() {
            try {
                const data = await getPostById((await params).postId);
                setPost(data);
            } catch (error) {
                console.error("Failed to fetch post:", error);
            }
        }
        getPost();
    }, [params, postId]);

    if (!post)
        return (
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h2 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                    Post not found
                </h2>
            </main>
        );
    return (
        <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
            {post && (
                <>
                    <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
                        {post.title}
                    </h1>
                    <Link
                        href={`/search?category=${post.category}`}
                        className="self-center mt-5"
                    >
                        <Button color="gray" className="rounded-pill" size="sm">
                            {post && post.category}
                        </Button>
                    </Link>
                    <Image
                        src={post.image}
                        width={1900}
                        height={600}
                        alt={post.title}
                        className="mt-10 p-3 max-h-[600px] w-full object-cover"
                    />
                    <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
                        <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="italic">
                            {(post?.content?.length / 1000).toFixed(0)} mins
                            read
                        </span>
                    </div>
                    <MDEditor.Markdown
                        source={post.content}
                        className="p-3 mt-5 max-w-6xl mx-auto w-full post-content"
                    />
                    <RecentPosts limit={3} currentPostId={post?._id} />
                </>
            )}
        </main>
    );
}

export default PostPage;
