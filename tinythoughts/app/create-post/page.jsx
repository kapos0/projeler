"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@/components/Form";
export default function CreatePost() {
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    text: "",
    tag: "",
  });
  async function createPost(e) {
    e.preventDefault();
    const tags = post.tag ? post.tag.split(", ") : [];
    setSubmitting(true);
    try {
      const response = await fetch("/api/posts/new", {
        method: "POST",
        body: JSON.stringify({
          text: post.text,
          userId: session?.user.id,
          tag: tags,
        }),
      });
      if (response.ok) router.push("/");
    } catch (error) {
      console.error("error", error);
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPost}
    />
  );
}
