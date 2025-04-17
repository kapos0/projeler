"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getPostById, publishPost, updatePost } from "@/actions/PostAction";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import MDEditor from "@uiw/react-md-editor";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";

export default function CreatePostPage({
    params: paramsPromise,
}: {
    params: Promise<{ postId: string }>;
}) {
    const params = React.use(paramsPromise);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        content: "",
        image: "",
        slug: "",
    });
    const { data } = useSession();
    const initializeForm = useCallback(async () => {
        try {
            setLoading(true);
            if (params.postId === "create") {
                setFormData({
                    title: "",
                    category: "",
                    content: "",
                    image: "",
                    slug: "",
                });
            } else {
                const post = await getPostById(params.postId);
                if (post) {
                    setFormData({
                        title: post.title,
                        category: post.category,
                        content: post.content,
                        image: post.image,
                        slug: post.slug,
                    });
                }
            }
        } catch (error) {
            console.error("Error initializing form:", error);
        } finally {
            setLoading(false);
        }
    }, [params.postId]);

    useEffect(() => {
        initializeForm();
    }, [initializeForm]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.category) return;

        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("content", formData.content);
        formDataToSend.append("image", formData.image);
        formDataToSend.append("slug", formData.title.replace(/\s+/g, "-"));
        try {
            setLoading(true);
            if (params.postId === "create") {
                await publishPost(formDataToSend);
            } else {
                await updatePost(params.postId, formDataToSend);
            }
            setFormData({
                title: "",
                category: "",
                content: "",
                image: "",
                slug: "",
            });
        } catch (err) {
            console.error("Error in handleSubmit:", err);
        } finally {
            setLoading(false);
        }
    }

    if (!data?.user && loading) return <Loading />;
    if (data?.user?.role !== "admin")
        return (
            <div>
                <h1 className="text-center mt-[25vh] font-extrabold text-5xl text-red-500">
                    Access Denied
                </h1>

                <Link
                    href="/"
                    className="text-center block mb-4 text-blue-500 hover:underline"
                >
                    Go back to Home
                </Link>
            </div>
        );

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-3xl my-7 font-semibold">
                {params.postId === "create" ? "Create a post" : "Update post"}
            </h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <Input
                        type="text"
                        placeholder="Title"
                        required
                        id="title"
                        value={formData.title}
                        className="flex-1"
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <Select
                        onValueChange={(value) =>
                            setFormData({ ...formData, category: value })
                        }
                        value={formData.category}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="uncategorized">
                                Uncategorized
                            </SelectItem>
                            <SelectItem value="news">News</SelectItem>
                            <SelectItem value="thoughts">Thoughts</SelectItem>
                            <SelectItem value="fun">Fun</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex justify-center align-center mx-auto w-full">
                    <ImageUpload
                        endpoint="imageUploader"
                        value={formData.image}
                        onChange={(url) =>
                            setFormData((prevFormData) => ({
                                ...prevFormData,
                                image: url,
                            }))
                        }
                    />
                </div>
                <MDEditor
                    value={formData.content}
                    height={700}
                    onChange={(value) => {
                        setFormData((prevFormData) => ({
                            ...prevFormData,
                            content: value || "",
                        }));
                    }}
                />

                <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                    {params.postId === "create" ? "Publish" : "Update"}
                </Button>
            </form>
        </div>
    );
}
