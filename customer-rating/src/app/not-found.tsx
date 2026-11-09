import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6 text-center text-[#161616]">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#e46f45]">404</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">Bu sayfa bulunamadı.</h1>
                <p className="mt-4 text-sm text-black/50">Bağlantı geçersiz veya artık aktif değil.</p>
                <Link
                    href="/"
                    className="mt-8 inline-flex rounded-full bg-[#161616] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#333]"
                >
                    Ana sayfaya dön
                </Link>
            </div>
        </main>
    );
}
