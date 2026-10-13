'use client'

import { useEffect, useState } from 'react'
import { formatRupiah, formatPercent } from '../../lib/trading/engine'

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
    return <div className="p-8">Loading positions...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Posisi Aktif</h1>

      {positions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-lg">Tidak ada posisi aktif saat ini</p>
          <p className="text-gray-400 text-sm mt-2">Rekomendasi akan diambil secara otomatis setiap hari</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Koin</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Harga Masuk</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">TP</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">SL</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Durasi</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(pos => {
                const duration = Math.floor((Date.now() - new Date(pos.openedAt).getTime()) / 60000)
                return (
                  <tr key={pos.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{pos.coinSymbol}</div>
                      <div className="text-xs text-gray-500">{pos.coinName}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{formatRupiah(pos.entryPrice)}</td>
                    <td className="px-4 py-3 text-right text-green-600 font-mono">{formatRupiah(pos.takeProfitPrice)}</td>
                    <td className="px-4 py-3 text-right text-red-600 font-mono">{formatRupiah(pos.stopLossPrice)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{duration} menit</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">OPEN</span>
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
