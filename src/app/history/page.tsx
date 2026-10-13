'use client'

import { useEffect, useState } from 'react'
import { formatRupiah, formatPercent } from '../../lib/trading/engine'

export default function HistoryPage() {
  const [trades, setTrades] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/trades')
      .then(res => res.json())
      .then(data => {
        setTrades(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="p-8">Loading history...</div>
  }

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      TAKE_PROFIT: 'bg-green-100 text-green-800',
      STOP_LOSS: 'bg-red-100 text-red-800',
      TIMEOUT_24H: 'bg-gray-100 text-gray-800',
    }
    return colors[reason] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Riwayat Trading</h1>

      {trades.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center">
          <p className="text-gray-500 text-lg">Belum ada riwayat transaksi</p>
          <p className="text-gray-400 text-sm mt-2">Transaksi yang selesai akan muncul di sini</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Koin</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Harga Masuk</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Harga Keluar</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">P&L Bersih</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Return</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">Alasan</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {new Date(trade.closedAt).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 font-medium">{trade.coinSymbol}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{formatRupiah(trade.entryPrice)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{formatRupiah(trade.exitPrice)}</td>
                  <td className={`px-4 py-3 text-right font-mono font-medium ${trade.netPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatRupiah(trade.netPnl)}
                  </td>
                  <td className={`px-4 py-3 text-right font-mono ${trade.returnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(trade.returnPercent)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${getReasonBadge(trade.closedReason)}`}>
                      {trade.closedReason}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
