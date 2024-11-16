import type { Metadata } from "next";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/assets/styles.css";

import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Basit ticketing uygulaması",
  description: "Belirli problemler için bir ticket uygulaması",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="flex flex-col h-screen max-h-screen">
          <Nav />
          <div className="flex-grow overflow-y-auto bg-page text-default-text">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
