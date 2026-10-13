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
    return <div className="p-8">Loading settings...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Pengaturan Trading</h1>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold">Mode Demo</h3>
            <p className="text-sm text-gray-500">Menggunakan data simulasi ketika API key tidak tersedia</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${settings.isDemoMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {settings.isDemoMode ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold">Auto Trading</h3>
            <p className="text-sm text-gray-500">Otomatis buka posisi dari rekomendasi AI</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${settings.isAutoTradingEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            {settings.isAutoTradingEnabled ? 'Aktif' : 'Nonaktif'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Modal per Transaksi</p>
            <p className="text-xl font-bold">Rp {Number(settings.capitalPerTrade).toLocaleString('id-ID')}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Target Take Profit</p>
            <p className="text-xl font-bold text-green-600">+{settings.takeProfitPercent}%</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Batas Stop Loss</p>
            <p className="text-xl font-bold text-red-600">{settings.stopLossPercent}%</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Timeout Posisi</p>
            <p className="text-xl font-bold">{settings.positionTimeoutHours} jam</p>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Status Koneksi CMC API</p>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${process.env.CMC_API_KEY ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="font-medium">
              {process.env.CMC_API_KEY ? 'Terhubung ke API' : 'Mode Demo (tidak ada API key)'}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-400 p-4 bg-blue-50 rounded-lg">
          <p className="font-medium text-blue-700 mb-1">Catatan:</p>
          <p>Semua transaksi adalah simulasi paper trading. Tidak ada transaksi nyata yang dikirim ke exchange.</p>
        </div>
      </div>
    </div>
  )
}
