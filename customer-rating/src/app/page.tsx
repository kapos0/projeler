import Link from "next/link";
import { Brand } from "@/components/brand";

export default function Home() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#f7f7f4] text-[#161616]">
            <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8 lg:px-10">
                <nav className="flex items-center justify-between">
                    <Brand />
                    <Link
                        href="/sign-in"
                        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium transition hover:border-black/30"
                    >
                        Yönetici girişi
                    </Link>
                </nav>

                <div className="grid flex-1 items-center gap-16 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
                    <div>
                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#e46f45]">
                            Misafir deneyimi yönetimi
                        </p>
                        <h1 className="max-w-xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-7xl">
                            Her geri bildirimle, <span className="text-[#b86b3f]">daha iyi</span> bir deneyim sunun.
                        </h1>
                        <p className="mt-7 max-w-lg text-lg leading-8 text-black/60">
                            Müşterilerinizin deneyimini masada dinleyin; ekibinizin güçlü yönlerini ve gelişim alanlarını
                            güvenilir verilerle yönetin.
                        </p>
                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                href="/sign-in"
                                className="rounded-full bg-[#161616] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#333]"
                            >
                                Ücretsiz başlayın
                            </Link>
                            <span className="flex items-center px-3 py-3 text-sm text-black/50">Kurulum birkaç dakika sürer</span>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md">
                        <div className="absolute -inset-8 rounded-[3rem] bg-[#e8e4d9]" />
                        <div className="relative rounded-[2.5rem] border border-black/10 bg-white p-8 shadow-2xl shadow-black/10">
                            <div className="mb-12 flex items-center justify-between">
                                <Brand compact />
                                <span className="rounded-full bg-[#f7f7f4] px-3 py-1.5 text-xs text-black/50">QR ile açılır</span>
                            </div>
                            <div className="mb-8">
                                <p className="mb-2 text-sm text-black/50">Misafir deneyimi</p>
                                <h2 className="text-3xl font-semibold tracking-tight">Deneyiminizi paylaşın.</h2>
                                <p className="mt-3 text-sm leading-6 text-black/50">Görüşleriniz hizmet kalitemizi geliştirmemize yardımcı olur.</p>
                            </div>
                            <div className="flex gap-2">
                                {["Çok kötü", "Kötü", "İyi", "Harika", "Mükemmel"].map((label, index) => (
                                    <div key={label} className="flex flex-1 flex-col items-center gap-2">
                                        <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${index === 4 ? "bg-[#e46f45] text-white" : "bg-[#f2f1ed]"}`}>
                                            {["×", "−", "·", "+", "✓"][index]}
                                        </span>
                                        <span className="text-center text-[10px] text-black/45">{label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-9 h-2 rounded-full bg-[#f2f1ed]">
                                <div className="h-2 w-4/5 rounded-full bg-[#e46f45]" />
                            </div>
                            <p className="mt-3 text-right text-xs text-black/40">30 saniyeden kısa</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
