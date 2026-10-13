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
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Memuat riwayat...</div>
      </div>
    )
  }

  const getReasonBadge = (reason: string) => {
    const colors: Record<string, string> = {
      TAKE_PROFIT: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      STOP_LOSS: 'bg-red-50 text-red-700 border-red-200',
      TIMEOUT_24H: 'bg-gray-50 text-gray-700 border-gray-200',
    }
    return colors[reason] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Trading</h1>
        <p className="text-gray-500 text-sm mt-1">Daftar transaksi yang telah selesai</p>
      </div>

      {trades.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">📜</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada riwayat</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto">Transaksi yang selesai akan muncul di halaman ini beserta detail P&L dan alasan penutupan.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Koin</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga Masuk</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Harga Keluar</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">P&L Bersih</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Return</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trades.map(trade => (
                <tr key={trade.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-xs text-gray-600 font-mono">
                    {new Date(trade.closedAt).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{trade.coinSymbol}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-gray-700">{formatRupiah(trade.entryPrice)}</td>
                  <td className="px-6 py-4 text-right font-mono text-sm text-gray-700">{formatRupiah(trade.exitPrice)}</td>
                  <td className={`px-6 py-4 text-right font-mono text-sm font-semibold ${trade.netPnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatRupiah(trade.netPnl)}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono text-sm ${trade.returnPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatPercent(trade.returnPercent)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getReasonBadge(trade.closedReason)}`}>
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
