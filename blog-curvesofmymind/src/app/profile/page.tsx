"use client";

import type React from "react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { signOut, useSession } from "next-auth/react";
import { deleteUser, updateUser } from "@/actions/UserAction";
import { redirect } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function ProfilePage() {
    const { data } = useSession();
    const [username, setUsername] = useState(data?.user.username);
    const [email, setEmail] = useState(data?.user.email);
    const [password, setPassword] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    async function handleProfileDelete() {
        try {
            await deleteUser(data?.user.id ?? "");
            await signOut();
            // Ensure header updates after sign out
        } catch (error) {
            console.error("Failed to delete profile:", error);
        }
    }

    async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        if (
            username === data?.user?.username &&
            email === data?.user.email &&
            !password
        ) {
            setShowAlert(true);
            return;
        }
        setShowAlert(false);
        const formdataTosend = new FormData();
        formdataTosend.append("username", username ?? "");
        formdataTosend.append("email", email ?? "");
        formdataTosend.append("password", password ?? "");
        formdataTosend.append("avatar", imageUrl ?? "");
        try {
            await updateUser(formdataTosend);
            await signOut();
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    }

    if (!data?.user.username) return redirect("/sign-in");

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <div className="w-full md:w-60 border-gray-200 p-4 space-y-4">
                <div className="flex items-center gap-3 p-2 rounded-md">
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                    <Badge variant="secondary" className="ml-auto">
                        {data?.user?.role}
                    </Badge>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-md">
                    <LogOut className="h-5 w-5" />
                    <Button
                        variant="outline"
                        onClick={async () => {
                            await signOut();
                            window.location.reload();
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Log Out
                    </Button>
                </div>
            </div>

            <div className="flex-1 p-4 md:p-8 flex justify-center">
                <div className="w-full max-w-md">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 md:mb-6">
                        Profile
                    </h1>

                    <div className="flex justify-center mb-4 md:mb-6">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32">
                            <AvatarImage
                                src={data?.user.avatar}
                                alt="Profile"
                            />
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                                <User className="h-12 w-12 md:h-16 md:w-16 text-gray-400 dark:text-gray-300" />
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="my-5">
                        <ImageUpload
                            endpoint="imageUploader"
                            value={imageUrl}
                            onChange={(url) => {
                                setImageUrl(url);
                            }}
                        />
                    </div>

                    <form
                        onSubmit={handleUpdate}
                        className="space-y-3 md:space-y-4"
                    >
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                        />
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                        />
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                        />

                        <Button
                            type="submit"
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 dark:text-gray-800"
                        >
                            Update
                        </Button>

                        <div className="flex justify-start pt-2">
                            <Button
                                variant="link"
                                className="text-red-500 hover:text-red-700 px-0 dark:text-red-400 dark:hover:text-red-300"
                                onClick={handleProfileDelete}
                            >
                                Delete Account
                            </Button>
                        </div>
                    </form>

                    {showAlert && (
                        <Alert className="mt-4 bg-red-50 border-red-100 text-red-500 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                            <AlertDescription>No changes made</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
