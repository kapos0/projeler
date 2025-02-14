import { notFound, redirect } from "next/navigation";
import {
    getPostsByAuthor,
    getProfileByUsername,
    isFollowing,
} from "@/controllers/profileController";
import ProfilePageClient from "./ProfilePageClient";
import { fetchUser } from "@/controllers/userController";

export default async function ProfilePageServer({ params }) {
    const session = await fetchUser();
    if (!session) return redirect("/sign-in");
    const { username } = await params;
    const isVisit = session.username === username;
    const user = await getProfileByUsername(username);
    if (!user) return notFound();
    const posts = await getPostsByAuthor(user._id);
    const following = await isFollowing(user._id);
    return (
        <ProfilePageClient
            user={user}
            posts={posts}
            following={following}
            isItVisit={isVisit}
        />
    );
}
