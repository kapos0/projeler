"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
    const router = useRouter();

    async function handleSignOut() {
        await authClient.signOut();
        router.push("/sign-in");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium transition hover:border-black/30"
        >
            Çıkış yap
        </button>
    );
}
