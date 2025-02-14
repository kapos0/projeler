/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import User from "@/models/user";
import Post from "@/models/post";
import { fetchUser } from "./userController";

export async function getNotifications() {
    try {
        const dbuser = await fetchUser();
        const userId = dbuser?._id.toString();
        if (!userId) return [];

        const user: any = await User.findById(userId)
            .populate({
                path: "notifications.creator",
                select: "id name username image",
            })
            .populate({
                path: "notifications.post",
                select: "id content image comments",
            })
            .lean(); // JavaScript nesnesine çevirmek için

        if (!user) return [];

        const notificationsWithComments = await Promise.all(
            user.notifications.map(async (notification: any) => {
                let commentData = null;
                if (notification.type === "COMMENT" && notification.post) {
                    const post: { comments: any[] } | null =
                        (await Post.findById(notification.post)
                            .select("comments")
                            .lean()) as unknown as { comments: any[] } | null;

                    if (post && Array.isArray(post.comments)) {
                        const comment = post.comments.find(
                            (c: any) =>
                                c._id.toString() ===
                                String(notification.comment)
                        );

                        if (comment) {
                            commentData = {
                                id: comment._id.toString(),
                                content: comment.content,
                                createdAt: comment.createdAt,
                            };
                        }
                    }
                }

                return {
                    id: notification._id.toString(),
                    creator: notification.creator
                        ? {
                              id: notification.creator._id.toString(),
                              name: notification.creator.name,
                              username: notification.creator.username,
                              image: notification.creator.image,
                          }
                        : null,
                    type: notification.type,
                    read: notification.read,
                    post: notification.post
                        ? {
                              id: notification.post._id.toString(),
                              content: notification.post.content,
                              image: notification.post.image,
                          }
                        : null,
                    comment: commentData,
                    createdAt: notification.createdAt,
                };
            })
        );

        return notificationsWithComments;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw new Error("Failed to fetch notifications");
    }
}

export async function markNotificationsAsRead(notificationIds: string[]) {
    try {
        await User.updateMany(
            { "notifications._id": { $in: notificationIds } },
            { $set: { "notifications.$[elem].read": true } },
            { arrayFilters: [{ "elem._id": { $in: notificationIds } }] }
        );
        return { success: true };
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return { success: false };
    }
}
