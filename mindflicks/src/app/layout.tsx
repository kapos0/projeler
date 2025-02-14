import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import "@/assets/globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>Mind Flicks</title>
                <meta charSet="UTF-8" />
                <link
                    rel="shortcut icon"
                    href="favicon.ico"
                    type="image/x-icon"
                />
            </head>
            <body className="min-h-screen">
                <SessionProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        disableTransitionOnChange
                    >
                        <Navbar />
                        <main className="py-8">
                            <div className="max-w-7xl mx-auto px-4">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                    <div className="hidden lg:block lg:col-span-3">
                                        <Sidebar />
                                    </div>
                                    <div className="lg:col-span-9">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </main>
                        <Toaster />
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
