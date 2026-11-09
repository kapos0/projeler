import { getSession } from "@/lib/auth/auth";
import { getDashboardData } from "@/lib/actions/board";
import DashboardBoard from "@/components/dashboard-board";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

export default function Dashboard() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    );
}

async function DashboardContent() {
    await connection();
    const session = await getSession();
    if (!session?.user) redirect("/sign-in");
    const data = await getDashboardData();
    if (!data) redirect("/sign-in");
    return <DashboardBoard initialData={data} />;
}

function DashboardSkeleton() {
    return (
        <div className="min-h-[calc(100vh-4rem)] animate-pulse bg-[#fff9fb] p-8">
            <div className="mx-auto h-10 max-w-375 rounded bg-pink-100" />
        </div>
    );
}
