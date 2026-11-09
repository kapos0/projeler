import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { Brand } from "@/components/brand";
import { auth } from "@/lib/auth";

export const instant = false;

export default async function SignInPage() {
    const session = await auth.api.getSession({ headers: await headers() });

    if (session) {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen bg-[#f7f7f4] px-5 py-8 text-[#161616]">
            <div className="mx-auto max-w-md">
                <div className="mb-10 px-1"><Brand compact /></div>
                <AuthForm />
            </div>
        </main>
    );
}
