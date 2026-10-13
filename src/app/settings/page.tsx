'use client'

import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setSettings(data.settings)
        setLoading(false)
      })
  }, [])

  if (loading || !settings) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Memuat pengaturan...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Trading</h1>
        <p className="text-gray-500 text-sm mt-1">Konfigurasi parameter dan status sistem</p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-yellow-500">⚡</span>
            Status Sistem
          </h3>

          <div className="space-y-3">
            <SettingRow
              label="Mode Demo"
              description="Menggunakan data simulasi ketika API key tidak tersedia"
              value={settings.isDemoMode ? 'Aktif' : 'Nonaktif'}
              valueColor="bg-yellow-100 text-yellow-800"
            />
            <SettingRow
              label="Auto Trading"
              description="Otomatis buka posisi dari rekomendasi AI"
              value={settings.isAutoTradingEnabled ? 'Aktif' : 'Nonaktif'}
              valueColor={settings.isAutoTradingEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-blue-500">⚙️</span>
            Parameter Trading
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <ParamCard
              label="Modal per Transaksi"
              value={`Rp ${Number(settings.capitalPerTrade).toLocaleString('id-ID')}`}
              desc="Alokasi modal setiap posisi baru"
            />
            <ParamCard
              label="Take Profit"
              value={`+${settings.takeProfitPercent}%`}
              desc="Target keuntungan otomatis"
              valueClass="text-emerald-600"
            />
            <ParamCard
              label="Stop Loss"
              value={`${settings.stopLossPercent}%`}
              desc="Batas kerugian otomatis"
              valueClass="text-red-600"
            />
            <ParamCard
              label="Timeout Posisi"
              value={`${settings.positionTimeoutHours} jam`}
              desc="Waktu maksimal posisi terbuka"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-purple-500">🔌</span>
            Koneksi API
          </h3>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${process.env.CMC_API_KEY ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
            <div>
              <p className="font-medium text-gray-900">
                {process.env.CMC_API_KEY ? 'Terhubung ke CoinMarketCap API' : 'Mode Demo (tanpa API key)'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {process.env.CMC_API_KEY ? 'Data harga dan rekomendasi asli dari CMC' : 'Data harga dan rekomendasi simulasi'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm font-medium text-blue-800 mb-1">ℹ️ Catatan Penting</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Semua transaksi adalah simulasi paper trading. Tidak ada transaksi nyata yang dikirim ke exchange eksternal. Hasil simulasi bukan jaminan keuntungan trading di pasar nyata.
          </p>
        </div>
      </div>
    </div>
  )
}

function SettingRow({ label, description, value, valueColor }: { label: string; description: string; value: string; valueColor: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${valueColor}`}>
        {value}
      </span>
    </div>
  )
}

function ParamCard({ label, value, desc, valueClass }: { label: string; value: string; desc: string; valueClass?: string }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${valueClass || 'text-gray-900'}`}>{value}</p>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  )
}
