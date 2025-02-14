"use client";
import { signIn } from "next-auth/react";

export async function githubSignIn() {
    await signIn("github");
}
