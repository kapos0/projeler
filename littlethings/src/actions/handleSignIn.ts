"use client";

import { signIn } from "next-auth/react";
import { toast } from "react-toastify";

export async function handleSignIn(provider: string, formData?: FormData) {
    try {
        if (provider === "credentials") {
            const email = formData?.get("email") as string;
            const password = formData?.get("password") as string;

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });
            if (result?.error) {
                toast("Please try again");
            }
        } else {
            await signIn(provider);
        }
    } catch (error) {
        throw new Error(
            (error as Error).message || "Unexpected error occurred"
        );
    }
}
