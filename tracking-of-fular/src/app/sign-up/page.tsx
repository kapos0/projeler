import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/sign-up-form";
import { connection } from "next/server";
import { Suspense } from "react";

export default function SignUp() {
    return <Suspense fallback={null}><SignUpContent /></Suspense>;
}

async function SignUpContent() {
    await connection();
    const session = await getSession();
    if (session?.user) redirect("/dashboard");
    return <SignUpForm />;
}
