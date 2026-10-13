'use client'

import { useEffect, useState } from 'react'
import { formatRupiah } from '../../lib/trading/engine'

export default function PositionsPage() {
  const [positions, setPositions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/positions')
      .then(res => res.json())
      .then(data => {
        setPositions(data.filter((p: any) => p.status === 'OPEN'))
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Memuat posisi...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Posisi Aktif</h1>
        <p className="text-gray-500 text-sm mt-1">Daftar posisi trading yang sedang terbuka</p>
      </div>

      {positions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">📈</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada posisi aktif</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">Rekomendasi trading akan diambil secara otomatis setiap hari dan posisi akan terbuka secara otomatis.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Koin</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga Masuk</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Take Profit</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Stop Loss</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Durasi</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {positions.map(pos => {
                const duration = Math.floor((Date.now() - new Date(pos.openedAt).getTime()) / 60000)
                return (
                  <tr key={pos.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {pos.coinSymbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{pos.coinSymbol}</p>
                          <p className="text-xs text-gray-500">{pos.coinName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-sm font-medium text-gray-900">{formatRupiah(pos.entryPrice)}</td>
                    <td className="px-6 py-4 text-right font-mono text-sm font-medium text-emerald-600">{formatRupiah(pos.takeProfitPrice)}</td>
                    <td className="px-6 py-4 text-right font-mono text-sm font-medium text-red-600">{formatRupiah(pos.stopLossPrice)}</td>
                    <td className="px-6 py-4 text-right text-sm text-gray-600">{duration} menit</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                        OPEN
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
