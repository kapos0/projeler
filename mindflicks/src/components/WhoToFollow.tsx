import { getRandomUsers } from "@/controllers/userController";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import FollowButton from "./FollowButton";

export default async function WhoToFollow() {
    const users = (await getRandomUsers()) || [];
    if (!Array.isArray(users) || users.length === 0) return null;
    return (
        <Card>
            <CardHeader>
                <CardTitle>Who to Follow</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {users?.map((user) => (
                        <div
                            key={user._id}
                            className="flex gap-2 items-center justify-between "
                        >
                            <div className="flex items-center gap-1">
                                <Link href={`/profile/${user.username}`}>
                                    <Avatar>
                                        <AvatarImage
                                            src={user.image ?? "/avatar.png"}
                                        />
                                    </Avatar>
                                </Link>
                                <div className="text-xs">
                                    <Link
                                        href={`/profile/${user.username}`}
                                        className="font-medium cursor-pointer"
                                    >
                                        {user.name}
                                    </Link>
                                    <p className="text-muted-foreground">
                                        @{user.username}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {user.followersCount.lenght || 0}{" "}
                                        followers
                                    </p>
                                </div>
                            </div>
                            <FollowButton userId={user._id.toString()} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
