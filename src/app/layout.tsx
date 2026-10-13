import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PaperTrade | AI Crypto Analytics",
  description: "Platform pengujian rekomendasi AI CoinMarketCap secara objektif",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-gray-50 font-sans">
        <div className="flex h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
            <div className="p-5 border-b border-slate-800">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="text-emerald-400">◆</span>
                PaperTrade
              </h1>
              <p className="text-xs text-slate-400 mt-1">AI Crypto Paper Trading</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              <NavLink href="/" icon="📊" label="Dashboard" active />
              <NavLink href="/positions" icon="📈" label="Posisi Aktif" />
              <NavLink href="/history" icon="📜" label="Riwayat Trading" />
              <NavLink href="/settings" icon="⚙️" label="Pengaturan" />
            </nav>

            <div className="p-4 border-t border-slate-800">
              <div className="bg-slate-800 rounded-lg p-3 text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                  <span className="text-slate-300 font-medium">DEMO Mode</span>
                </div>
                <p className="text-slate-500">Data simulasi aktif</p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({ href, icon, label, active }: { href: string; icon: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
        active ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}
