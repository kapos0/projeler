"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

function SignOut() {
    async function handleSignOut() {
        await signOut();
    }

    return (
        <div className="flex justify-center">
            <Button variant="link" onClick={handleSignOut}>
                Sign Out
            </Button>
        </div>
    );
}

export { SignOut };
