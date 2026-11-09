import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import SignInForm from "@/components/sign-in-form";
import { connection } from "next/server";
import { Suspense } from "react";

export default function SignIn() {
    return <Suspense fallback={null}><SignInContent /></Suspense>;
}

async function SignInContent() {
    await connection();
    const session = await getSession();
    if (session?.user) redirect("/dashboard");
    return <SignInForm />;
}
