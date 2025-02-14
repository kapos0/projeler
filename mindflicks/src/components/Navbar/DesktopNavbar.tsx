"use client";
import { BellIcon, HomeIcon, LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ModeToggle from "@/components/mode-toggle";
import { signOut, useSession } from "next-auth/react";

export default function DesktopNavbar() {
    const session = useSession();
    return (
        <div className="hidden md:flex items-center space-x-4">
            <ModeToggle />

            <Button variant="ghost" className="flex items-center gap-2" asChild>
                <Link href="/">
                    <HomeIcon className="w-4 h-4" />
                    <span className="hidden lg:inline">Home</span>
                </Link>
            </Button>

            {session.data?.user ? (
                <>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        asChild
                    >
                        <Link href="/notifications">
                            <BellIcon className="w-4 h-4" />
                            <span className="hidden lg:inline">
                                Notifications
                            </span>
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        asChild
                    >
                        <Link
                            href={`/profile/${
                                session.data.user.email?.split("@")[0] ??
                                "unknown"
                            }`}
                        >
                            <UserIcon className="w-4 h-4" />
                            <span className="hidden lg:inline">Profile</span>
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex items-center gap-3 justify-start w-full"
                        onClick={() => signOut()}
                    >
                        <LogOutIcon className="w-4 h-4" />
                        Logout
                    </Button>
                </>
            ) : (
                <Button variant="default">
                    <Link href="/sign-in">Login</Link>
                </Button>
            )}
        </div>
    );
}
