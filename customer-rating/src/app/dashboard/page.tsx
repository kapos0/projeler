import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";
import { RestaurantForm } from "@/components/restaurant-form";
import { connectToDatabase } from "@/lib/db";
import { Restaurant } from "@/models/restaurant";
import { Table } from "@/models/table";
import { TableForm } from "@/components/table-form";
import { TableQr } from "@/components/table-qr";
import { Rating } from "@/models/rating";
import { Brand } from "@/components/brand";
import Link from "next/link";
import { RatingCard } from "@/components/rating-card";
import { deleteRating } from "@/app/dashboard/rating-actions";
import { env } from "@/lib/env";

async function DashboardContent() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in");
    }

    await connectToDatabase();
    const restaurant = await Restaurant.findOne({ ownerId: session.user.id }).lean();
    const [tables, ratingSummary, tablePerformance, recentRatings] = restaurant
        ? await Promise.all([
              Table.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 }).lean(),
              Rating.aggregate<{ _id: null; count: number; average: number; foodAverage: number; staffAverage: number }>([
                  { $match: { restaurantId: restaurant._id } },
                  {
                      $group: {
                          _id: null,
                          count: { $sum: 1 },
                          average: { $avg: "$overallRating" },
                          foodAverage: { $avg: "$foodRating" },
                          staffAverage: { $avg: "$staffRating" },
                      },
                  },
              ]),
              Rating.aggregate<{
                  _id: string;
                  count: number;
                  average: number;
                  foodAverage: number;
                  staffAverage: number;
              }>([
                  { $match: { restaurantId: restaurant._id } },
                  {
                      $group: {
                          _id: "$tableId",
                          count: { $sum: 1 },
                          average: { $avg: "$overallRating" },
                          foodAverage: { $avg: "$foodRating" },
                          staffAverage: { $avg: "$staffRating" },
                      },
                  },
                  { $sort: { average: -1 } },
              ]),
              Rating.find({ restaurantId: restaurant._id })
                  .sort({ createdAt: -1 })
                  .limit(10)
                  .select("tableId overallRating foodRating staffRating comment createdAt")
                  .lean(),
          ])
        : [[], [], [], []];
    const activeTables = tables.filter((table) => table.isActive);
    const tableNames = new Map(tables.map((table) => [String(table._id), table.name]));
    const summary = ratingSummary[0];
    const appUrl = env.publicAppUrl;

    return (
        <main className="min-h-screen bg-[#f7f7f4] px-5 py-8 text-[#161616] sm:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="flex items-center justify-between">
                    <Brand compact />
                    <SignOutButton />
                </header>

                <section className="mt-16">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b86b3f]">İşletme merkezi</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
                        Hoş geldiniz, {session.user.name}.
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-8 text-black/55">
                        İşletmenizi, masalarınızı ve misafir deneyimi verilerinizi tek merkezden yönetin.
                    </p>
                </section>

                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                    {[
                        [String(summary?.count ?? 0), "Toplam geri bildirim"],
                        [summary ? summary.average.toFixed(1) : "—", "Ortalama puan"],
                        [String(activeTables.length), "Aktif masa"],
                    ].map(([value, label]) => (
                        <div key={label} className="rounded-3xl bg-white p-6 shadow-sm">
                            <p className="text-4xl font-semibold tracking-tight">{value}</p>
                            <p className="mt-2 text-sm text-black/45">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 max-w-2xl">
                    {restaurant ? (
                        <div className="space-y-8">
                            <div className="rounded-3xl bg-white p-7 shadow-sm">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#b86b3f]">Deneyim özeti</p>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Hizmet kalitenizi izleyin</h2>
                                </div>
                                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                    {[
                                        ["Genel", summary?.average],
                                        ["Yemek", summary?.foodAverage],
                                        ["Personel", summary?.staffAverage],
                                    ].map(([label, value]) => (
                                        <div key={label} className="rounded-2xl bg-[#f7f7f4] p-4">
                                            <p className="text-xs text-black/45">{label}</p>
                                            <p className="mt-2 text-2xl font-semibold">{typeof value === "number" ? value.toFixed(1) : "—"}</p>
                                            <p className="mt-1 text-xs text-black/40">/ 5 puan</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-3xl bg-white p-8 shadow-sm">
                                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#33774b]">İşletmeniz</p>
                                <h2 className="mt-3 text-3xl font-semibold tracking-tight">{restaurant.name}</h2>
                                {restaurant.description && <p className="mt-2 text-sm leading-6 text-black/50">{restaurant.description}</p>}
                            </div>
                            {tables.length > 0 && (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#e46f45]">Masa yönetimi</p>
                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Masa ve QR kodları</h2>
                                    </div>
                                    {tables.map((table) => (
                                        <TableQr
                                            key={String(table._id)}
                                            name={table.name}
                                            description={table.description}
                                            url={`${appUrl}/r/${table.publicSlug}`}
                                            tableId={String(table._id)}
                                            isActive={table.isActive}
                                        />
                                    ))}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#b86b3f]">Masa performansı</p>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Masalarınızı karşılaştırın</h2>
                                </div>
                                {tablePerformance.length > 0 ? (
                                    <div className="grid gap-3">
                                        {tablePerformance.map((performance) => (
                                            <article key={String(performance._id)} className="rounded-3xl bg-white p-6 shadow-sm">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div>
                                                        <h3 className="font-semibold">{tableNames.get(String(performance._id)) ?? "Masa"}</h3>
                                                        <p className="mt-1 text-xs text-black/40">{performance.count} geri bildirim</p>
                                                    </div>
                                                    <span className="rounded-full bg-[#fff1eb] px-3 py-1.5 text-sm font-semibold text-[#c9552f]">
                                                        {performance.average.toFixed(1)} / 5
                                                    </span>
                                                </div>
                                                <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                                                    {[
                                                        ["Genel", performance.average],
                                                        ["Yemek", performance.foodAverage],
                                                        ["Personel", performance.staffAverage],
                                                    ].map(([label, value]) => (
                                                        <div key={label} className="rounded-xl bg-[#f7f7f4] px-3 py-2">
                                                            <span className="block text-xs text-black/40">{label}</span>
                                                            <span className="mt-1 block font-semibold">
                                                                {typeof value === "number" ? value.toFixed(1) : "—"}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-black/15 bg-white/50 p-8 text-center">
                                        <p className="text-sm text-black/50">Masa performansı için henüz veri yok.</p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#b86b3f]">Misafir geri bildirimleri</p>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">Son paylaşımlar</h2>
                                    </div>
                                    <Link href="/dashboard/ratings" className="text-sm font-medium text-[#b86b3f] hover:underline">Tümünü gör</Link>
                                </div>
                                {recentRatings.length > 0 ? (
                                    <div className="grid gap-4">
                                        {recentRatings.map((rating) => (
                                            <RatingCard
                                                key={String(rating._id)}
                                                ratingId={String(rating._id)}
                                                tableName={tableNames.get(String(rating.tableId)) ?? "Masa"}
                                                overallRating={rating.overallRating}
                                                foodRating={rating.foodRating}
                                                staffRating={rating.staffRating}
                                                comment={rating.comment}
                                                createdAt={rating.createdAt}
                                                displayedCategory="overall"
                                                deleteAction={deleteRating}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-3xl border border-dashed border-black/15 bg-white/50 p-8 text-center">
                                        <p className="text-sm text-black/50">Henüz geri bildirim yok.</p>
                                        <p className="mt-2 text-xs text-black/35">İlk misafir paylaşımı burada görünecek.</p>
                                    </div>
                                )}
                            </div>
                            <TableForm />
                        </div>
                    ) : (
                        <RestaurantForm />
                    )}
                </div>
            </div>
        </main>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<main className="min-h-screen bg-[#f7f7f4]" />}>
            <DashboardContent />
        </Suspense>
    );
}
