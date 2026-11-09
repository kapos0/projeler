"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm({
    initialMode = "sign-in",
}: {
    initialMode?: AuthMode;
}) {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState("");
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setIsPending(true);

        try {
            const result =
                mode === "sign-in"
                    ? await authClient.signIn.email({
                          email,
                          password,
                          rememberMe,
                      })
                    : await authClient.signUp.email({ name, email, password });

            if (result.error) {
                setError(
                    result.error.message ?? "İşlem sırasında bir hata oluştu.",
                );
                return;
            }

            router.replace("/dashboard");
        } catch {
            setError("Sunucuya bağlanılamadı. Lütfen tekrar deneyin.");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <div className="rounded-4xl bg-white p-7 shadow-xl shadow-black/5 sm:p-10">
            <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-[#b86b3f]">
                    İşletme yönetimi
                </p>
                <h1 className="text-3xl font-semibold tracking-[-0.03em]">
                    {mode === "sign-in"
                        ? "Tekrar hoş geldiniz."
                        : "İşletmenizi güçlendirin."}
                </h1>
                <p className="mt-3 text-sm leading-6 text-black/50">
                    {mode === "sign-in"
                        ? "Misafir deneyimi içgörüleriniz için hesabınıza giriş yapın."
                        : "Misafirlerinizin sesini dinlemeye hemen başlayın."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "sign-up" && (
                    <label className="block text-sm font-medium text-black/70">
                        Ad soyad
                        <input
                            required
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="name"
                            className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none focus:border-[#e46f45]"
                        />
                    </label>
                )}
                <label className="block text-sm font-medium text-black/70">
                    E-posta
                    <input
                        required
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none focus:border-[#e46f45]"
                    />
                </label>
                <label className="block text-sm font-medium text-black/70">
                    Şifre
                    <input
                        required
                        minLength={8}
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete={
                            mode === "sign-in"
                                ? "current-password"
                                : "new-password"
                        }
                        className="mt-2 w-full rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 outline-none focus:border-[#e46f45]"
                    />
                </label>
                {mode === "sign-in" && (
                    <label className="flex cursor-pointer items-center gap-3 text-sm text-black/55">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) =>
                                setRememberMe(event.target.checked)
                            }
                            className="h-4 w-4 rounded border-black/20 accent-[#e46f45]"
                        />
                        Oturumumu açık tut
                    </label>
                )}
                {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </p>
                )}
                <button
                    disabled={isPending}
                    className="w-full rounded-xl bg-[#161616] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#333] disabled:cursor-wait disabled:opacity-50"
                >
                    {isPending
                        ? "Bekleyin..."
                        : mode === "sign-in"
                          ? "Giriş yap"
                          : "Hesap oluştur"}
                </button>
            </form>

            <button
                type="button"
                onClick={() => {
                    setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                    setError("");
                }}
                className="mt-6 w-full text-center text-sm text-black/50 underline decoration-black/20 underline-offset-4"
            >
                {mode === "sign-in"
                    ? "Henüz hesabınız yok mu? Hesap oluşturun"
                    : "Zaten hesabınız var mı? Giriş yapın"}
            </button>
        </div>
    );
}
