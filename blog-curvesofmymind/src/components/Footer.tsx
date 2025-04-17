"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
    return (
        <footer className="w-full py-8 border-t-8 border-t-teal-500 border bg-background">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col">
                        <Link
                            href="/"
                            className="self-start whitespace-nowrap text-lg sm:text-xl font-semibold"
                        >
                            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                                Turhan&apos;s
                            </span>
                            <span className="ml-1">Blog</span>
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm font-semibold tracking-tight">
                            About
                        </h2>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="https://turhanportfolyo.netlify.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                My Portfolio
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Follow us
                        </h2>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="https://www.github.com/kapos0"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Github
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Legal
                        </h2>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="#"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Terms &amp; Conditions
                            </Link>
                        </div>
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()}{" "}
                        <Link href="#" className="hover:underline">
                            Turhan&apos;s blog
                        </Link>
                        . All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
