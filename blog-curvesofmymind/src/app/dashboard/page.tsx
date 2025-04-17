"use client";
import { useEffect, useState } from "react";
import { deletePost, fetchRecentPosts, getPosts } from "@/actions/PostAction";
import { PostType } from "@/models/PostModel";
import PostCardForAdmin from "@/components/PostCardForAdmin";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserTable } from "@/components/UserTable";
import { DashboardStats } from "@/components/DashBoardStats";
import { fetchAllUsers, fetchRecentUsers } from "@/actions/UserAction";
import { UserType } from "@/models/UserModel";

export default function DashBoardPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [recentUsers, setRecentUsers] = useState<UserType[]>([]);
    const [recentPosts, setRecentPosts] = useState<PostType[]>([]);

    async function getAllPosts() {
        try {
            const res = await getPosts();
            if (res) setPosts(res);
        } catch (error) {
            console.error(error);
        }
    }
    async function getAllUsers() {
        try {
            const res = await fetchAllUsers();
            setUsers(res);
        } catch (error) {
            console.error(error);
        }
    }

    async function getRecentPosts() {
        try {
            const res = await fetchRecentPosts();
            setRecentPosts(res);
        } catch (error) {
            console.error(error);
        }
    }

    async function getRecentUsers() {
        try {
            const res = await fetchRecentUsers();
            setRecentUsers(res);
        } catch (error) {
            console.error(error);
        }
    }

    function handlePostDeleted(deletedPostId: string) {
        setPosts((prevPosts: PostType[]) =>
            prevPosts.filter((post) => post._id !== deletedPostId)
        );
    }

    useEffect(() => {
        getRecentUsers();
        getRecentPosts();
        getAllPosts();
        getAllUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between my-4">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <Link href="/dashboard/post/create">
                    <Button
                        variant="outline"
                        className="rounded-full"
                        style={{ cursor: "pointer" }}
                    >
                        Create Post
                    </Button>
                </Link>
            </div>
            <section>
                <h2 className="text-xl font-semibold mb-4">User Management</h2>
                <UserTable users={users} />
            </section>

            <section className="my-4">
                <h2 className="text-xl font-semibold mb-4">
                    Dashboard Overview
                </h2>
                <DashboardStats
                    recentPosts={recentPosts}
                    recentUsers={recentUsers}
                    totalUsersLength={users?.length}
                    totalPostsLength={posts?.length}
                />
            </section>
            <h2 className="text-xl font-semibold mb-4">Posts</h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {posts &&
                    posts.map((post: PostType) => (
                        <div className="w-full" key={post._id}>
                            <PostCardForAdmin
                                key={post._id}
                                _id={post._id}
                                title={post.title}
                                content={post.content}
                                category={post.category}
                                image={post.image}
                                userId={post.userId}
                                slug={post.slug}
                                createdAt={post.createdAt}
                                updatedAt={post.updatedAt}
                                onDelete={() => deletePost(post._id)}
                                onUpdate={() =>
                                    router.push("dashboard/post/" + post._id)
                                }
                                onPostDeleted={handlePostDeleted}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
}
