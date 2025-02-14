import { auth } from "@/auth";
import { redirect } from "next/navigation";
import CreatePost from "@/components/CreatePost";
import WhoToFollow from "@/components/WhoToFollow";
import { fetchUser } from "@/controllers/userController";
import { getPosts } from "@/controllers/postController";
import PostCard from "@/components/PostCard";

export default async function HomePage() {
    const session = await auth();
    if (!session) redirect("/sign-in");
    const posts = await getPosts();
    const dbUser = await fetchUser();
    const dbUserId = dbUser?._id.toString();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            <div className="lg:col-span-6">
                {session ? <CreatePost /> : null}
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id.toString()}
                            post={{ ...post, _id: post._id.toString() }}
                            dbUserId={dbUserId as string}
                            isInProfilePage={false}
                        />
                    ))}
                </div>
            </div>
            <div className="hidden lg:block lg:col-span-4 sticky top-20">
                <WhoToFollow />
            </div>
        </div>
    );
}
