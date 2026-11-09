"use client";

import { useActionState } from "react";
import { createTable, type TableActionState } from "@/app/dashboard/table-actions";

const initialState: TableActionState = {};

export function TableForm() {
    const [state, formAction, isPending] = useActionState(createTable, initialState);

    return (
        <form action={formAction} className="rounded-3xl bg-white p-7 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#e46f45]">Yeni masa</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">QR kodlu masa ekleyin</h2>
            <p className="mt-2 text-sm leading-6 text-black/50">
                Masa adına göre misafirlerinizin kullanacağı benzersiz bir bağlantı oluşturacağız.
            </p>
            <label className="mt-6 block text-sm font-medium text-black/70">
                Masa adı
                <input
                    name="name"
                    required
                    maxLength={50}
                    placeholder="Masa adı"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none focus:border-[#e46f45]"
                />
            </label>
            <label className="mt-4 block text-sm font-medium text-black/70">
                Açıklama <span className="font-normal text-black/40">(İsteğe bağlı)</span>
                <textarea
                    name="description"
                    maxLength={200}
                    rows={2}
                    placeholder="Örn. Bahçedeki köşe masa"
                    className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none focus:border-[#e46f45]"
                />
            </label>
            {state.error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
            {state.success && <p className="mt-4 rounded-xl bg-[#e9f5ed] px-4 py-3 text-sm text-[#33774b]">Masa oluşturuldu.</p>}
            <button
                type="submit"
                disabled={isPending}
                className="mt-5 rounded-xl bg-[#161616] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-wait disabled:opacity-50"
            >
                {isPending ? "Ekleniyor..." : "Masa ekle"}
            </button>
        </form>
    );
}
