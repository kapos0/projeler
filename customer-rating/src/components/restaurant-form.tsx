"use client";

import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRestaurant, type RestaurantActionState } from "@/app/dashboard/actions";

const initialState: RestaurantActionState = {};

export function RestaurantForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(createRestaurant, initialState);

    useEffect(() => {
        if (state.success) {
            router.refresh();
        }
    }, [router, state.success]);

    if (state.success) {
        return (
            <div className="rounded-3xl bg-[#e9f5ed] p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#33774b]">İşletme hazır</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1d4b2d]">İşletmeniz oluşturuldu.</h2>
                <p className="mt-2 text-sm leading-6 text-[#33774b]">
                    Masalarınızı eklemek için panel yenileniyor...
                </p>
            </div>
        );
    }

    return (
        <form action={formAction} className="rounded-3xl bg-white p-7 shadow-sm sm:p-8">
            <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#b86b3f]">Kurulum</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">İşletme profilinizi oluşturun</h2>
                <p className="mt-2 text-sm leading-6 text-black/50">
                    Misafirlerinizin geri bildirim ekranında göreceği işletme bilgilerini girin.
                </p>
            </div>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-black/70">
                    İşletme adı
                    <input
                        name="name"
                        required
                        minLength={2}
                        maxLength={120}
                        placeholder="İşletmenizin adı"
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none focus:border-[#e46f45]"
                    />
                </label>
                <label className="block text-sm font-medium text-black/70">
                    Kısa açıklama <span className="font-normal text-black/40">(İsteğe bağlı)</span>
                    <textarea
                        name="description"
                        maxLength={500}
                        rows={3}
                        placeholder="Müşterilerinize birkaç kelimeyle kendinizi anlatın."
                        className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none focus:border-[#e46f45]"
                    />
                </label>
            </div>
            {state.error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
            <button
                type="submit"
                disabled={isPending}
                className="mt-6 rounded-xl bg-[#161616] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-wait disabled:opacity-50"
            >
                {isPending ? "Kaydediliyor..." : "İşletmeyi oluştur"}
            </button>
        </form>
    );
}
