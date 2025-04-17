"use client";

import { FileTextIcon, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { UserType } from "@/models/UserModel";
import { PostType } from "@/models/PostModel";
import Image from "next/image";

export function DashboardStats({
    totalUsersLength,
    totalPostsLength,
    recentUsers,
    recentPosts,
}: {
    totalUsersLength: number;
    totalPostsLength: number;
    recentUsers: UserType[];
    recentPosts: PostType[];
}) {
    const router = useRouter();
    return (
        <div className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">
                                    TOTAL USERS
                                </p>
                                <p className="text-3xl font-medium mt-1">
                                    {totalUsersLength}
                                </p>
                            </div>
                            <div className="bg-teal-600 h-12 w-12 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Posts Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">
                                    TOTAL POSTS
                                </p>
                                <p className="text-3xl font-medium mt-1">
                                    {totalPostsLength}
                                </p>
                            </div>
                            <div className="bg-green-600 h-12 w-12 rounded-full flex items-center justify-center">
                                <FileTextIcon className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-gray-500 font-medium">
                            Recent users
                        </h3>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                                            USER IMAGE
                                        </th>
                                        <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                                            USERNAME
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user: UserType) => (
                                        <tr
                                            key={user._id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-3 px-4">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            user.avatar ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={user.username}
                                                    />
                                                    <AvatarFallback>
                                                        {user.username
                                                            .substring(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {user.username}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Posts */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-gray-500 font-medium">
                            Recent posts
                        </h3>
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-300 text-purple-500 hover:text-purple-600"
                            onClick={() => router.push("/search/*")}
                        >
                            See all
                        </Button>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                                            POST IMAGE
                                        </th>
                                        <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                                            POST TITLE
                                        </th>
                                        <th className="text-left py-3 px-4 text-gray-500 font-medium text-sm">
                                            CATEGORY
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentPosts.map((post: PostType) => (
                                        <tr
                                            key={post._id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-3 px-4">
                                                <div className="h-8 w-8 rounded overflow-hidden">
                                                    <Image
                                                        width={64}
                                                        height={64}
                                                        src={
                                                            post.image ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={post.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {post.title}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {post.category}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
