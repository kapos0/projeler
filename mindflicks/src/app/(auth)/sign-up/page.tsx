"use client";
import Link from "next/link";
import { register } from "@/controllers/userController";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function SignUpPage() {
    const user = useSession();
    useEffect(() => {
        if (user.status !== "unauthenticated") {
            redirect("/");
        }
    }, [user.status]);

    async function handleGoogleFastLogin() {
        try {
            await signIn("google");
        } catch (error) {
            console.error(error);
        }
    }
    async function handleGithubFastLogin() {
        try {
            await signIn("github");
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <main className="relative min-h-screen w-full bg-white">
            <div className="p-6" x-data="app">
                <header className="flex w-full justify-end">
                    <div>
                        <Link
                            href="/sign-in"
                            className="lg:hidden rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-black ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200"
                        >
                            LOGIN
                        </Link>
                    </div>
                </header>
                <div className="absolute left-1/2 top-1/2 mx-auto max-w-sm -translate-x-1/2 -translate-y-1/2 transform space-y-4 text-center w-full">
                    <div className="space-y-4">
                        <header className="mb-3 text-4xl font-bold text-black">
                            Create your profile
                        </header>
                        <form action={register}>
                            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 my-4 ">
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="User Name"
                                    className="my-3 w-full border-none bg-transparent outline-hidden focus:outline-hidden"
                                />
                            </div>
                            <div className="w-full my-4 rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email..."
                                    className="my-3 w-full border-none bg-transparent outline-hidden focus:outline-hidden"
                                />
                            </div>
                            <div className="w-full my-4 rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="my-3 w-full border-none bg-transparent outline-hidden focus:outline-hidden"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-2xl border-b-4 bg-black py-3 font-bold text-white active:translate-y-[0.125rem]"
                            >
                                CREATE ACCOUNT
                            </button>
                        </form>
                    </div>
                    <div className="flex items-center space-x-4">
                        <hr className="w-full border border-gray-300" />
                        <div className="font-semibold text-gray-400">OR</div>
                        <hr className="w-full border border-gray-300" />
                    </div>
                    <footer>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={handleGoogleFastLogin}
                                className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-2.5 font-bold text-black ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200"
                            >
                                GOOGLE
                            </button>
                            <button
                                onClick={handleGithubFastLogin}
                                className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-2.5 font-bold text-black ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200"
                            >
                                GITHUB
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
}
