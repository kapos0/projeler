"use client";

import { QRCodeSVG } from "qrcode.react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    toggleTableStatus,
    updateTable,
    type TableActionState,
} from "@/app/dashboard/table-actions";

type TableQrProps = {
    name: string;
    description?: string;
    url: string;
    tableId: string;
    isActive: boolean;
};

export function TableQr({
    name,
    description,
    url,
    tableId,
    isActive,
}: TableQrProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [state, formAction, isPending] = useActionState<
        TableActionState,
        FormData
    >(async (previousState, formData) => {
        const result = await updateTable(previousState, formData);

        if (result.success) {
            setIsEditing(false);
        }

        return result;
    }, {});

    useEffect(() => {
        if (state.success) {
            startTransition(() => router.refresh());
        }
    }, [router, state.success]);

    useEffect(() => {
        if (!isCopied) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setIsCopied(false);
        }, 2000);

        return () => window.clearTimeout(timeoutId);
    }, [isCopied]);

    async function copyUrl() {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
    }

    function downloadQr() {
        const qrElement = document.getElementById(`qr-${tableId}`);

        if (!(qrElement instanceof SVGElement)) {
            return;
        }

        const svg = new XMLSerializer().serializeToString(qrElement);
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = `${name.toLowerCase().replace(/[^a-z0-9]+/gi, "-") || "masa"}-qr.svg`;
        link.click();
        URL.revokeObjectURL(downloadUrl);
    }

    return (
        <article
            className={`flex flex-col gap-5 rounded-3xl p-6 shadow-sm sm:flex-row sm:items-center ${isActive ? "bg-white" : "bg-black/3 opacity-75"}`}
        >
            {isActive && (
                <div className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
                    <QRCodeSVG
                        id={`qr-${tableId}`}
                        value={url}
                        size={128}
                        bgColor="#ffffff"
                        fgColor="#161616"
                        level="M"
                    />
                </div>
            )}
            <div className="min-w-0">
                <p
                    className={`text-sm font-semibold uppercase tracking-[0.15em] ${isActive ? "text-[#33774b]" : "text-black/40"}`}
                >
                    {isActive ? "Aktif masa" : "Pasif masa"}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    {name}
                </h3>
                {description && (
                    <p className="mt-1 text-sm leading-6 text-black/50">
                        {description}
                    </p>
                )}
                {isActive && (
                    <p className="mt-2 truncate text-sm text-black/45">{url}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                    {isActive && (
                        <button
                            type="button"
                            onClick={copyUrl}
                            aria-live="polite"
                            className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:border-black/30"
                        >
                            <span
                                className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#33774b] text-white transition-all duration-300 ${isCopied ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                                aria-hidden="true"
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    className="h-3 w-3"
                                >
                                    <path
                                        d="m3.5 8 3 3 6-6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            {isCopied ? "Kopyalandı" : "Bağlantıyı kopyala"}
                        </button>
                    )}
                    {isActive && (
                        <button
                            type="button"
                            onClick={downloadQr}
                            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:border-black/30"
                        >
                            QR indir
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => setIsEditing((current) => !current)}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:border-black/30"
                    >
                        {isEditing ? "Vazgeç" : "Düzenle"}
                    </button>
                    <form action={toggleTableStatus}>
                        <input type="hidden" name="tableId" value={tableId} />
                        <button
                            type="submit"
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? "border border-red-200 text-red-700 hover:bg-red-50" : "bg-[#161616] text-white hover:bg-[#333]"}`}
                        >
                            {isActive ? "Pasif" : "Aktif"}
                        </button>
                    </form>
                </div>
                {isEditing && (
                    <form
                        action={formAction}
                        className="mt-5 space-y-3 rounded-2xl bg-[#f7f7f4] p-4"
                    >
                        <input type="hidden" name="tableId" value={tableId} />
                        <label className="block text-sm font-medium text-black/70">
                            Masa adı
                            <input
                                name="name"
                                required
                                maxLength={50}
                                defaultValue={name}
                                className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:border-[#e46f45]"
                            />
                        </label>
                        <label className="block text-sm font-medium text-black/70">
                            Açıklama{" "}
                            <span className="font-normal text-black/40">
                                (İsteğe bağlı)
                            </span>
                            <textarea
                                name="description"
                                maxLength={200}
                                rows={2}
                                defaultValue={description}
                                placeholder="Örn. Bahçedeki köşe masa"
                                className="mt-1.5 w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2.5 outline-none focus:border-[#e46f45]"
                            />
                        </label>
                        {state.error && (
                            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                                {state.error}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="rounded-xl bg-[#161616] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-wait disabled:opacity-50"
                        >
                            {isPending
                                ? "Kaydediliyor..."
                                : "Değişiklikleri kaydet"}
                        </button>
                    </form>
                )}
            </div>
        </article>
    );
}
