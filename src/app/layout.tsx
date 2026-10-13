import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Crypto Paper Trading",
  description: "Platform pengujian rekomendasi AI CoinMarketCap secara objektif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="font-sans">
        <nav className="bg-white border-b px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <Link href="/" className="font-bold text-lg">PaperTrade</Link>
            <Link href="/" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/positions" className="text-gray-600 hover:text-gray-900">Posisi</Link>
            <Link href="/history" className="text-gray-600 hover:text-gray-900">Riwayat</Link>
            <Link href="/settings" className="text-gray-600 hover:text-gray-900">Pengaturan</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
