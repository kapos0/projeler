"use client";

import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { createUserAction } from "./createUser";

export async function handleSignUp(formData: FormData) {
    const res: { message: string } = await createUserAction(formData);
    if (res) {
        toast(res.message + " Please sign in.");
        redirect("/sign-in");
    }
}
