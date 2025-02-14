"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createUserPost } from "@/controllers/postController";
import toast from "react-hot-toast";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import ImageUpload from "./ImageUpload";

export default function CreatePost() {
    const user = useSession();
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [showImageUpload, setShowImageUpload] = useState(false);

    async function handleSubmit() {
        if (!content.trim() && !imageUrl) return;
        setIsPosting(true);
        try {
            const result = await createUserPost(content, imageUrl);
            if (result?.success) {
                // reset the form
                setContent("");
                setImageUrl("");
                setShowImageUpload(false);

                toast.success("Post created successfully");
            }
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error("Failed to create post");
        } finally {
            setIsPosting(false);
        }
    }

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex space-x-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage
                                src={user?.data?.user?.image || "/avatar.png"}
                            />
                        </Avatar>
                        <Textarea
                            placeholder="What's on your mind?"
                            className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isPosting}
                        />
                    </div>

                    {(showImageUpload || imageUrl) && (
                        <div className="border rounded-lg p-4">
                            <ImageUpload
                                endpoint="postImage"
                                value={imageUrl}
                                onChange={(url) => {
                                    setImageUrl(url);
                                    if (!url) setShowImageUpload(false);
                                }}
                            />
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t pt-4">
                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-primary"
                                onClick={() =>
                                    setShowImageUpload((prev) => !prev)
                                }
                                disabled={isPosting}
                            >
                                <ImageIcon className="size-4 mr-2" />
                                Photo
                            </Button>
                        </div>
                        <Button
                            className="flex items-center"
                            onClick={handleSubmit}
                            disabled={!content.trim() || isPosting}
                        >
                            {isPosting ? (
                                <>
                                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <SendIcon className="size-4 mr-2" />
                                    Post
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
