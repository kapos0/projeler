import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/css/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import { Roboto } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    variable: "--font-roboto",
});

export const metadata: Metadata = {
    title: "Fular | Kişisel takip panon",
    description: "Kitap, film, podcast ve daha fazlasını kişisel panolarında takip et.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="tr" className={cn(roboto.variable, "font-sans")}>
            <body className="antialiased">
                <Navbar />
                {children}
            </body>
        </html>
    );
}
