import { getSession } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Suspense } from "react";
import ProfileForm from "@/components/profile-form";

export default function ProfilePage() {
    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <ProfileContent />
        </Suspense>
    );
}

async function ProfileContent() {
    await connection();
    const session = await getSession();

    if (!session?.user) redirect("/sign-in");

    const initials = session.user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <main className="min-h-[calc(100vh-4rem)] bg-[#fff9fb] px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <p className="text-sm font-medium text-primary">Hesabın</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                        Profilim
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Fular deneyimindeki temel hesap bilgilerin.
                    </p>
                </div>
                <Card className="border-pink-100 bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle>Hesap bilgileri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-primary text-xl text-white">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <ProfileForm name={session.user.name} email={session.user.email} />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

function ProfileSkeleton() {
    return (
        <main className="min-h-[calc(100vh-4rem)] animate-pulse bg-[#fff9fb] px-4 py-10 sm:px-8">
            <div className="mx-auto h-48 max-w-2xl rounded-xl bg-pink-100" />
        </main>
    );
}
