import React from "react";
import Link from "next/link";
import RecentPosts from "@/components/RecentPosts";
import ToTheMySite from "@/components/ToTheMySite";

export default function Index() {
    return (
        <div className="flex flex-col justify-center items-center mb-5">
            <div className="flex flex-col gap-6 p-28 px-9 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold lg:text-6xl">
                    Welcome to my Blog
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Velit reiciendis commodi qui minus et suscipit vero quis
                    impedit ad animi maiores soluta voluptatum ratione, at,
                    labore est eum dolorum. Nemo!
                </p>
                <Link
                    href="/search/*"
                    className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
                >
                    View all posts
                </Link>
            </div>
            <RecentPosts />
            <ToTheMySite />
        </div>
    );
}
