"use client";

import { FormEvent, useState } from "react";

const ratingLabels = ["Çok kötü", "Kötü", "İyi", "Harika", "Mükemmel"];
const ratingSymbols = ["×", "−", "·", "+", "✓"];

type RatingFormProps = {
    restaurantName: string;
    tableName: string;
    tableId: string;
    restaurantId: string;
};

export function RatingForm({
    restaurantName,
    tableName,
    tableId,
    restaurantId,
}: RatingFormProps) {
    const [rating, setRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [staffRating, setStaffRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [dark, setDark] = useState(false);
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (rating === 0 || foodRating === 0 || staffRating === 0) return;
        setError("");
        setIsPending(true);

        try {
            const result = await fetch("/api/ratings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    restaurantId,
                    tableId,
                    overallRating: rating,
                    foodRating,
                    staffRating,
                    comment,
                }),
            });

            const response = (await result.json()) as { error?: string };

            if (!result.ok) {
                setError(response.error ?? "Değerlendirme kaydedilemedi.");
                return;
            }

            setSubmitted(true);
        } catch {
            setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
        } finally {
            setIsPending(false);
        }
    }

    if (submitted) {
        return (
            <div
                className={`flex min-h-136 flex-col items-center justify-center rounded-4xl p-8 text-center ${dark ? "bg-[#1b1b1b] text-white" : "bg-white text-[#161616]"}`}
            >
                <span className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#e46f45] text-2xl text-white">
                    ✓
                </span>
                <h2 className="text-3xl font-semibold tracking-tight">
                    Teşekkürler!
                </h2>
                <p
                    className={`mt-3 max-w-xs text-sm leading-6 ${dark ? "text-white/55" : "text-black/55"}`}
                >
                    Geri bildiriminiz ekibimize iletildi. Bizi geliştirmemize
                    yardımcı olduğunuz için teşekkür ederiz.
                </p>
                <p
                    className={`mt-1 max-w-xs text-sm leading-6 ${dark ? "text-white/55" : "text-black/55"}`}
                >
                    Bu sayfayı kapatabilir veya yeni bir geri bildirim
                    paylaşabilirsiniz.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setSubmitted(false);
                        setRating(0);
                        setFoodRating(0);
                        setStaffRating(0);
                        setComment("");
                    }}
                    className={`mt-8 rounded-full px-5 py-3 text-sm font-medium ${dark ? "bg-white text-[#161616]" : "bg-[#161616] text-white"}`}
                >
                    Yeni geri bildirim paylaş
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`rounded-4xl p-7 shadow-xl shadow-black/5 sm:p-10 ${dark ? "bg-[#1b1b1b] text-white" : "bg-white text-[#161616]"}`}
        >
            <div className="mb-10 flex items-start justify-between">
                <div>
                    <p
                        className={`mb-2 text-sm ${dark ? "text-white/45" : "text-black/45"}`}
                    >
                        {restaurantName}
                    </p>
                    <h1 className="text-3xl font-semibold tracking-[-0.03em]">
                        Deneyiminizi paylaşın.
                    </h1>
                    <p
                        className={`mt-3 text-sm leading-6 ${dark ? "text-white/50" : "text-black/50"}`}
                    >
                        {tableName}
                    </p>
                </div>
                <button
                    type="button"
                    aria-label={dark ? "Açık temaya geç" : "Koyu temaya geç"}
                    onClick={() => setDark((current) => !current)}
                    className={`rounded-full px-3 py-2 text-xs ${dark ? "bg-white/10 text-white/70" : "bg-[#f4f3ef] text-black/55"}`}
                >
                    {dark ? "☼ Açık" : "◐ Koyu"}
                </button>
            </div>

            <RatingScale
                label="Genel deneyim"
                value={rating}
                onChange={setRating}
                dark={dark}
            />
            <RatingScale
                label="Yemekler"
                value={foodRating}
                onChange={setFoodRating}
                dark={dark}
            />
            <RatingScale
                label="Personel"
                value={staffRating}
                onChange={setStaffRating}
                dark={dark}
            />

            <label
                className={`mt-9 block text-sm font-medium ${dark ? "text-white/80" : "text-black/70"}`}
                htmlFor="comment"
            >
                Deneyiminiz hakkında ne paylaşmak istersiniz?{" "}
                <span className="font-normal opacity-50">(İsteğe bağlı)</span>
            </label>
            <textarea
                id="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Yemekler, hizmet veya ortam hakkında görüşleriniz..."
                rows={4}
                className={`mt-3 w-full resize-none rounded-2xl border p-4 text-sm outline-none transition focus:border-[#e46f45] ${dark ? "border-white/10 bg-white/5 placeholder:text-white/25" : "border-black/10 bg-[#fafaf8] placeholder:text-black/30"}`}
            />
            <button
                type="submit"
                disabled={
                    rating === 0 ||
                    foodRating === 0 ||
                    staffRating === 0 ||
                    isPending
                }
                className="mt-5 w-full rounded-2xl bg-[#e46f45] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#d65f35] disabled:cursor-not-allowed disabled:opacity-35"
            >
                {isPending ? "Gönderiliyor..." : "Değerlendirmeyi gönder"}
            </button>
            {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-xs text-red-700">
                    {error}
                </p>
            )}
            <p
                className={`mt-4 text-center text-xs ${dark ? "text-white/30" : "text-black/35"}`}
            >
                Geri bildiriminiz anonim olarak değerlendirilir.
            </p>
        </form>
    );
}

type RatingScaleProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
    dark: boolean;
};

function RatingScale({ label, value, onChange, dark }: RatingScaleProps) {
    return (
        <fieldset className="mt-7">
            <legend
                className={`mb-3 text-sm font-medium ${dark ? "text-white/80" : "text-black/70"}`}
            >
                {label}
            </legend>
            <div className="flex gap-1.5 sm:gap-3">
                {ratingLabels.map((ratingLabel, index) => {
                    const ratingValue = index + 1;
                    return (
                        <button
                            key={ratingLabel}
                            type="button"
                            aria-label={`${label}: ${ratingValue} - ${ratingLabel}`}
                            aria-pressed={value === ratingValue}
                            onClick={() => onChange(ratingValue)}
                            className={`flex min-w-0 flex-1 flex-col items-center gap-2 rounded-2xl py-2.5 transition ${value === ratingValue ? "bg-[#e46f45] text-white" : dark ? "bg-white/7 text-white/55 hover:bg-white/12" : "bg-[#f5f4f0] text-black/45 hover:bg-[#eceae4]"}`}
                        >
                            <span className="text-xl">
                                {ratingSymbols[index]}
                            </span>
                            <span className="text-[10px] leading-3 sm:text-xs">
                                {ratingLabel}
                            </span>
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}
