import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, CheckCircle2, Layers3 } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col bg-white">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="container mx-auto px-4 py-32">
                    <div className="mx-auto max-w-4xl text-center">
                        <h1 className="text-black mb-6 text-6xl font-bold">
                            Okuma yolculuğunu
                            <span className="block text-primary">
                                kendin tasarla.
                            </span>
                        </h1>
                        <p className="text-muted-foreground mb-10 text-xl">
                            Okuduğun, okumak istediğin ve keşfetmek için
                            biriktirdiğin kitapları sana ait panolarda takip et.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <Link href="/sign-up">
                                <Button
                                    size="lg"
                                    className="h-12 px-8 text-lg font-medium"
                                >
                                    Ücretsiz başla
                                    <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                            <p className="text-sm text-muted-foreground">
                                Ücretsiz, sade ve tamamen sana ait.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="border-t bg-white pt-24">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-12 md:grid-cols-3">
                            <div className="flex flex-col">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-3 text-2xl font-semibold text-black">
                                    Kitaplarını düzenle
                                </h3>
                                <p className="text-muted-foreground">
                                    Okuma listelerini board ve kolonlarla kendi
                                    yöntemine göre şekillendir.
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <Layers3 className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-3 text-2xl font-semibold text-black">
                                    İlerlemeni gör
                                </h3>
                                <p className="text-muted-foreground">
                                    Kitaplarını sürükleyerek “Okumak
                                    istiyorum”dan “Okudum”a taşı.
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                    <CheckCircle2 className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="mb-3 text-2xl font-semibold text-black">
                                    Notlarını kaybetme
                                </h3>
                                <p className="text-muted-foreground">
                                    Yazar, kategori, etiket, puan ve kişisel
                                    notlarını tek bir yerde sakla.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
