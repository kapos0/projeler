import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Müşteri Deneyim Merkezi | Misafir içgörülerini büyütün",
    description: "Restoran ve kafeler için güvenilir müşteri deneyimi yönetimi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html lang="tr" className="h-full antialiased">
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
