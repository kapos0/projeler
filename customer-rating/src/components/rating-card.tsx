"use client";

import type { FormEvent } from "react";

type RatingCardProps = {
    ratingId: string;
    tableName: string;
    overallRating: number;
    foodRating?: number;
    staffRating?: number;
    comment?: string;
    createdAt: Date | string;
    displayedCategory: "overall" | "food" | "staff";
    deleteAction: (formData: FormData) => Promise<void>;
};

const categoryLabels = {
    overall: "Genel deneyim",
    food: "Yemekler",
    staff: "Personel",
} as const;

export function RatingCard({
    ratingId,
    tableName,
    overallRating,
    foodRating,
    staffRating,
    comment,
    createdAt,
    displayedCategory,
    deleteAction,
}: RatingCardProps) {
    const categoryRating = displayedCategory === "food" ? foodRating : displayedCategory === "staff" ? staffRating : overallRating;

    function confirmDelete(event: FormEvent<HTMLFormElement>) {
        if (!window.confirm("Bu değerlendirmeyi silmek istediğinizden emin misiniz?")) {
            event.preventDefault();
        }
    }

    return (
        <article className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold">{tableName}</p>
                    <p className="mt-1 text-xs text-black/40">
                        {new Date(createdAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <span className="rounded-full bg-[#fff1eb] px-3 py-1.5 text-sm font-semibold text-[#c9552f]">
                    {categoryRating ?? "—"}/5
                </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-black/50">
                <span className="rounded-full bg-[#f7f7f4] px-3 py-1.5">{categoryLabels[displayedCategory]}</span>
                {displayedCategory !== "overall" && <span className="rounded-full bg-[#f7f7f4] px-3 py-1.5">Genel {overallRating}/5</span>}
            </div>
            {comment && <p className="mt-4 text-sm leading-6 text-black/60">{comment}</p>}
            <form action={deleteAction} onSubmit={confirmDelete} className="mt-5">
                <input type="hidden" name="ratingId" value={ratingId} />
                <button
                    type="submit"
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
                >
                    Değerlendirmeyi sil
                </button>
            </form>
        </article>
    );
}
