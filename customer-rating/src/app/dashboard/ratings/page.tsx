import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Brand } from "@/components/brand";
import { SignOutButton } from "@/components/sign-out-button";
import { RatingCard } from "@/components/rating-card";
import { connectToDatabase } from "@/lib/db";
import { Rating } from "@/models/rating";
import { Restaurant } from "@/models/restaurant";
import { Table } from "@/models/table";
import { deleteRating } from "@/app/dashboard/rating-actions";

export const instant = false;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type RatingCategory = "overall" | "food" | "staff";

function getValue(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function validDate(value: string): string {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function validCategory(value: string): RatingCategory {
    return value === "food" || value === "staff" ? value : "overall";
}

export default async function RatingsPage({ searchParams }: { searchParams: SearchParams }) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect("/sign-in");
    }

    const params = await searchParams;
    const from = validDate(getValue(params.from));
    const to = validDate(getValue(params.to));
    const category = validCategory(getValue(params.category));

    await connectToDatabase();
    const restaurant = await Restaurant.findOne({ ownerId: session.user.id }).select("_id name").lean();

    if (!restaurant) {
        redirect("/dashboard");
    }

    const query: { restaurantId: unknown; createdAt?: { $gte?: Date; $lte?: Date } } = { restaurantId: restaurant._id };
    if (from || to) {
        query.createdAt = {};
        if (from) query.createdAt.$gte = new Date(`${from}T00:00:00`);
        if (to) query.createdAt.$lte = new Date(`${to}T23:59:59.999`);
    }

    const [ratings, tables] = await Promise.all([
        Rating.find(query)
            .sort({ createdAt: -1 })
            .limit(200)
            .select("tableId overallRating foodRating staffRating comment createdAt")
            .lean(),
        Table.find({ restaurantId: restaurant._id }).select("_id name").lean(),
    ]);
    const tableNames = new Map(tables.map((table) => [String(table._id), table.name]));
    const categoryLabel = category === "food" ? "Yemekler" : category === "staff" ? "Personel" : "Genel deneyim";

    return (
        <main className="min-h-screen bg-[#f7f7f4] px-5 py-8 text-[#161616] sm:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="flex items-center justify-between">
                    <Brand compact />
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:border-black/30">
                            Panele dön
                        </Link>
                        <SignOutButton />
                    </div>
                </header>

                <section className="mt-16">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b86b3f]">Misafir geri bildirimleri</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Tüm değerlendirmeler</h1>
                    <p className="mt-5 max-w-xl text-lg leading-8 text-black/55">Tarih aralığına ve görmek istediğiniz puan kategorisine göre değerlendirmelerinizi inceleyin.</p>
                </section>

                <form className="mt-10 grid gap-4 rounded-3xl bg-white p-6 shadow-sm sm:grid-cols-3 sm:items-end">
                    <label className="text-sm font-medium text-black/70">
                        Başlangıç tarihi
                        <input type="date" name="from" defaultValue={from} className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] px-3 py-2.5 outline-none focus:border-[#e46f45]" />
                    </label>
                    <label className="text-sm font-medium text-black/70">
                        Bitiş tarihi
                        <input type="date" name="to" defaultValue={to} className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] px-3 py-2.5 outline-none focus:border-[#e46f45]" />
                    </label>
                    <label className="text-sm font-medium text-black/70">
                        Puan kategorisi
                        <select name="category" defaultValue={category} className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] px-3 py-2.5 outline-none focus:border-[#e46f45]">
                            <option value="overall">Genel deneyim</option>
                            <option value="food">Yemekler</option>
                            <option value="staff">Personel</option>
                        </select>
                    </label>
                    <button type="submit" className="rounded-xl bg-[#161616] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333] sm:col-span-3 sm:justify-self-start">
                        Filtrele
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-black/45">{ratings.length} değerlendirme gösteriliyor</p>
                        <p className="mt-1 text-sm font-medium text-black/70">{categoryLabel} puanları</p>
                    </div>
                    {(from || to) && <Link href={`/dashboard/ratings?category=${category}`} className="text-sm font-medium text-[#b86b3f] hover:underline">Tarih filtresini temizle</Link>}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {ratings.length > 0 ? ratings.map((rating) => (
                        <RatingCard
                            key={String(rating._id)}
                            ratingId={String(rating._id)}
                            tableName={tableNames.get(String(rating.tableId)) ?? "Masa"}
                            overallRating={rating.overallRating}
                            foodRating={rating.foodRating}
                            staffRating={rating.staffRating}
                            comment={rating.comment}
                            createdAt={rating.createdAt}
                            displayedCategory={category}
                            deleteAction={deleteRating}
                        />
                    )) : (
                        <div className="rounded-3xl border border-dashed border-black/15 bg-white/50 p-10 text-center md:col-span-2">
                            <p className="text-sm text-black/50">Seçtiğiniz filtrelerde değerlendirme bulunamadı.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
