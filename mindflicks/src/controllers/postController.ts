/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { revalidatePath } from "next/cache";
import { fetchUser } from "./userController";
import Post from "@/models/post";
import User from "@/models/user";
import { connectDB } from "@/lib/conntectDB";

export async function createUserPost(content: string, image: string) {
    try {
        await connectDB();
        const user = await fetchUser();
        if (!user) return;

        const post = await Post.create({
            content,
            image: image,
            author: user._id,
            comments: [],
            likes: [],
        });

        await User.findByIdAndUpdate(
            { _id: user._id },
            {
                $push: { posts: post._id },
            }
        );

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to create post:", error);
        return { success: false, error: "Failed to create post" };
    }
}

export async function getPost(postId: string) {
    try {
        const post = await Post.findById({ _id: postId });
        return post;
    } catch (error) {
        console.error("Error in getPost", error);
        throw new Error("Failed to fetch post");
    }
}

export async function getPosts() {
    try {
        const posts = await Post.find()
            .populate({
                path: "author",
                select: "id name image username",
            })
            .populate({
                path: "comments.author",
                select: "id username image name",
            })
            .sort({ createdAt: -1 })
            .lean();

        const formattedPosts = posts.map((post: any) => ({
            _id: post._id.toString(), // Convert ObjectId to string
            author: {
                ...post.author,
                _id: post.author._id.toString(), // Convert ObjectId to string
            },
            content: post.content,
            image: post.image,
            comments: post.comments.map((comment: any) => ({
                ...comment,
                _id: comment._id.toString(), // Convert ObjectId to string
                author: {
                    ...comment.author,
                    _id: comment.author._id.toString(), // Convert ObjectId to string
                },
            })),
            likes: post.likes.map((like: any) => like.toString()), // Convert ObjectId to string
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            __v: post.__v,
            _count: {
                likes: post.likes.length,
                comments: post.comments.length,
            },
        }));

        return formattedPosts;
    } catch (error) {
        console.error("Error in getPosts", error);
        throw new Error("Failed to fetch posts");
    }
}

export async function toggleLike(postId: string) {
    try {
        const user = await fetchUser();
        const userId = user?._id;
        if (!userId) return;
        const post = await Post.findById(postId).select("author likes");
        if (!post) throw new Error("Post not found");

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            // Beğeniyi kaldır
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likes: postId } });

            // Bildirimi kaldır (kendi gönderisi değilse)
            await User.updateOne(
                { _id: post.author },
                {
                    $pull: {
                        notifications: {
                            creator: userId,
                            type: "LIKE",
                            post: postId,
                        },
                    },
                }
            );
        } else {
            // Beğeni ekle
            await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
            await User.updateOne({ _id: userId }, { $push: { likes: postId } });

            // Bildirim oluştur (eğer kişi kendi gönderisini beğenmiyorsa)
            if (post.author.toString() !== userId) {
                await User.updateOne(
                    { _id: post.author },
                    {
                        $push: {
                            notifications: {
                                creator: userId,
                                type: "LIKE",
                                post: postId,
                                createdAt: new Date(),
                                read: false,
                            },
                        },
                    }
                );
            }
        }
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle like:", error);
        return { success: false, error: "Failed to toggle like" };
    }
}

export async function createComment(postId: string, content: string) {
    try {
        const user = await fetchUser();
        const userId = user?._id;
        if (!userId) return;
        if (!content) throw new Error("Content is required");

        const post = await Post.findById(postId).select("author comments");
        if (!post) throw new Error("Post not found");

        // Yeni yorum oluştur
        const newComment = await post.comments.create({
            content,
            author: userId,
            createdAt: new Date(),
        });

        // Yorum ekle
        post.comments.push(newComment);
        await post.save();

        // Eğer yorum başkasının gönderisine yapıldıysa bildirim oluştur
        if (post.author.toString() !== userId) {
            await User.updateOne(
                { _id: post.author },
                {
                    $push: {
                        notifications: {
                            creator: userId,
                            type: "COMMENT",
                            post: postId,
                            comment: newComment._id, // Yorumun ObjectId'si
                            createdAt: new Date(),
                            read: false,
                        },
                    },
                }
            );
        }
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to create comment:", error);
        return { success: false, error: "Failed to create comment" };
    }
}

export async function deletePost(postId: string) {
    try {
        const user = await fetchUser();
        const userId = user._id.toString();
        if (!userId) return;

        const post = await Post.findById(postId).select("author");
        if (!post) throw new Error("Post not found");
        if (post.author.toString() !== userId)
            throw new Error("Unauthorized - no delete permission");

        // Gönderiyi sil
        await Post.deleteOne({ _id: postId });

        // Kullanıcının post listesinden sil
        await User.updateOne({ _id: userId }, { $pull: { posts: postId } });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete post:", error);
        return { success: false, error: "Failed to delete post" };
    }
}
