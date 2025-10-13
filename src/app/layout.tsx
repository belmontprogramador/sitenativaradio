import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nativa On",
  description: "O amor do Brasil",
  icons: {
    icon: "/favicon.ico.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-dvh flex flex-col bg-black text-white`}
      >
        {/* 🔹 HEADER */}
        <header className="w-full bg-[#fd9200] py-3 shadow-md">
          <div className="container mx-auto flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo RadioNaTV"
              width={140}
              height={60}
              className="h-auto"
              priority
            />
          </div>
        </header>

        {/* 🔹 CONTEÚDO */}
        <main className="container mx-auto p-6 flex-1">
          {children}
        </main>

        {/* 🔹 FOOTER */}
        <footer className="w-full bg-[#111] text-white text-center py-4 text-sm">
          Impulsione MKT
        </footer>
      </body>
    </html>
  );
}
