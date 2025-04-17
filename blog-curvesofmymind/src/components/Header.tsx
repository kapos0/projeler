"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSession } from "next-auth/react";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const sessions = useSession();
    const user = sessions?.data?.user;
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="border-b border-gray-200 bg-background overflow-x-hidden">
            <div className="container flex items-center justify-between h-16 px-4 mx-auto md:px-6 lg:px-2">
                <div className="flex items-center">
                    <Link
                        href="/"
                        className="flex items-center coursour-pointer"
                    >
                        <div className="py-1 p-2 text-xl font-bold text-white rounded bg-gradient-to-r from-purple-500 to-pink-500">
                            Turhan&apos;s
                        </div>
                        <span className="ml-2 text-xl font-semibold">Blog</span>
                    </Link>
                </div>

                <div className="relative max-w-md mx-auto hidden lg:block px-4 lg:px-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full pl-10 lg:w-[300px] rounded-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            type="button"
                            variant="default"
                            className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                            onClick={() =>
                                router.push(`/search/${searchQuery}`)
                            }
                        >
                            Search
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-4 md:space-x-6 lg:gap-12">
                    <div className="hidden lg:flex items-center space-x-6">
                        <Link
                            href="/"
                            className={`${
                                pathname === "/"
                                    ? "text-blue-600 font-bold"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className={`${
                                pathname === "/about"
                                    ? "text-blue-600 font-bold"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            About
                        </Link>
                        <Link
                            href="/projects"
                            className={`${
                                pathname === "/projects"
                                    ? "text-blue-600 font-bold"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            Projects
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center">
                        <ThemeToggle />
                        {user && user.role === "admin" && (
                            <Button
                                variant="outline"
                                className="rounded-full"
                                style={{ cursor: "pointer" }}
                            >
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        )}
                        {user ? (
                            <Button
                                variant="outline"
                                className="rounded-full ms-5"
                                style={{ cursor: "pointer" }}
                            >
                                <Link href="/profile">Profile</Link>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className="rounded-full ms-5"
                                style={{ cursor: "pointer" }}
                            >
                                <Link href="/sign-in">Sign In</Link>
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center lg:hidden space-x-2">
                        <ThemeToggle />
                        <button onClick={() => setMenuOpen(!menuOpen)}>
                            {menuOpen ? (
                                <X className="h-6 w-6 text-muted-foreground" />
                            ) : (
                                <Menu className="h-6 w-6 text-muted-foreground" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="lg:hidden bg-background border-t border-gray-200">
                    <div className="p-4">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-10 rounded-md"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                type="button"
                                variant="default"
                                className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer"
                                onClick={() => {
                                    router.push(`/search/${searchQuery}`);
                                    setMenuOpen(false);
                                }}
                            >
                                Search
                            </Button>
                        </div>
                        <nav className="flex flex-col items-center space-y-4">
                            <Link
                                href="/"
                                className={`${
                                    pathname === "/"
                                        ? "text-blue-600 font-bold"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className={`${
                                    pathname === "/about"
                                        ? "text-blue-600 font-bold"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                href="/projects"
                                className={`${
                                    pathname === "/projects"
                                        ? "text-blue-600 font-bold"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                Projects
                            </Link>
                            <div className="flex flex-col items-center space-y-4">
                                {user && user.role === "admin" && (
                                    <Button
                                        variant="outline"
                                        className="rounded-full"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Link href="/dashboard">Dashboard</Link>
                                    </Button>
                                )}
                                {user ? (
                                    <Button
                                        variant="outline"
                                        className="rounded-full"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Link href="/profile">Profile</Link>
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="rounded-full"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Link href="/sign-in">Sign In</Link>
                                    </Button>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}
