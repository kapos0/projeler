import { Suspense } from "react";
import { connection } from "next/server";
import { RatingForm } from "@/components/rating-form";
import { connectToDatabase } from "@/lib/db";
import { Table } from "@/models/table";
import { Restaurant } from "@/models/restaurant";
import { notFound } from "next/navigation";
import { Brand } from "@/components/brand";

type RatingPageProps = {
    params: Promise<{ slug: string }>;
};

async function RatingPageContent({ params }: RatingPageProps) {
    const { slug } = await params;
    await connection();
    await connectToDatabase();
    const table = await Table.findOne({
        publicSlug: slug,
        isActive: true,
    }).lean();

    if (!table) {
        notFound();
    }

    const restaurant = await Restaurant.findById(table.restaurantId)
        .select("name description")
        .lean();

    if (!restaurant) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#f7f7f4] px-5 py-6 text-[#161616] sm:px-8 sm:py-10">
            <div className="mx-auto max-w-xl">
                <header className="mb-7 flex items-center justify-between px-1">
                    <Brand compact />
                    <span className="text-xs text-black/35">{table.name}</span>
                </header>
                <RatingForm
                    restaurantName={restaurant.name}
                    tableName={table.name}
                    tableId={String(table._id)}
                    restaurantId={String(restaurant._id)}
                />
                <p className="mt-6 text-center text-xs text-black/35">
                    Görüşleriniz işletmenin hizmet kalitesini geliştirmesine
                    yardımcı olur.
                </p>
            </div>
        </main>
    );
}

export default function RatingPage({ params }: RatingPageProps) {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-[#f7f7f4] px-5 py-6 text-[#161616] sm:px-8 sm:py-10">
                    <div className="mx-auto max-w-xl">
                        <div className="mb-7 h-5 w-36 animate-pulse rounded bg-black/10" />
                        <div className="h-96 animate-pulse rounded-3xl bg-white/70" />
                    </div>
                </main>
            }
        >
            <RatingPageContent params={params} />
        </Suspense>
    );
}
