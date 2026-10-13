'use client'

import { useEffect, useState } from 'react'
import { formatRupiah, formatPercent } from '../lib/trading/engine'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-gray-500">Memuat dashboard...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan performa trading otomatis</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Total Dialokasikan"
          value={formatRupiah(stats?.totalAllocated || 0)}
          icon="💵"
          color="blue"
        />
        <StatCard
          label="Modal Digunakan"
          value={formatRupiah(stats?.usedCapital || 0)}
          icon="🏦"
          color="indigo"
        />
        <StatCard
          label="Realized P&L"
          value={formatRupiah(stats?.realizedPnl || 0)}
          icon="📊"
          color="emerald"
          positive={(stats?.realizedPnl || 0) >= 0}
        />
        <StatCard
          label="Win Rate"
          value={`${(stats?.winRate || 0).toFixed(1)}%`}
          icon="🎯"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCardMini label="Take Profit" value={`${stats?.tpCount || 0}`} color="emerald" />
        <StatCardMini label="Stop Loss" value={`${stats?.slCount || 0}`} color="red" />
        <StatCardMini label="Timeout 24h" value={`${stats?.timeoutCount || 0}`} color="gray" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Sistem</h3>
          <div className="space-y-3">
            <StatusRow label="Mode Operasi" value={stats?.mode || 'DEMO'} badgeColor="bg-yellow-100 text-yellow-800" />
            <StatusRow label="Auto Trading" value={stats?.settings?.isAutoTradingEnabled ? 'Aktif' : 'Nonaktif'} badgeColor={stats?.settings?.isAutoTradingEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} />
            <StatusRow label="Target TP" value={`+${stats?.settings?.takeProfitPercent || 20}%`} badgeColor="bg-emerald-100 text-emerald-800" />
            <StatusRow label="Batas SL" value={`${stats?.settings?.stopLossPercent || -10}%`} badgeColor="bg-red-100 text-red-800" />
            <StatusRow label="Modal per Trade" value={formatRupiah(stats?.settings?.capitalPerTrade || 1000000)} badgeColor="bg-blue-100 text-blue-800" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Trading</h3>
          <div className="grid grid-cols-2 gap-4">
            <SummaryItem label="Total Transaksi" value={`${stats?.totalTrades || 0}`} />
            <SummaryItem label="Posisi Aktif" value={`${stats?.openPositions || 0}`} />
            <SummaryItem label="Trade Profit" value={`${stats?.winningTrades || 0}`} />
            <SummaryItem label="Trade Loss" value={`${stats?.losingTrades || 0}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, positive }: { label: string; value: string; icon: string; color: string; positive?: boolean }) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-50 to-blue-100 border-blue-200',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200',
    emerald: 'from-emerald-50 to-emerald-100 border-emerald-200',
    amber: 'from-amber-50 to-amber-100 border-amber-200',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-5`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${positive === true ? 'bg-green-200 text-green-800' : positive === false ? 'bg-red-200 text-red-800' : 'bg-white/60 text-gray-600'}`}>
          {positive === true ? '+' : positive === false ? '' : ''}
        </span>
      </div>
      <p className="text-xs text-gray-600 font-medium mb-1">{label}</p>
      <p className={`text-xl font-bold ${positive === true ? 'text-green-700' : positive === false ? 'text-red-700' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}

function StatCardMini({ label, value, color }: { label: string; value: string; color: string }) {
  const colorClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 border-emerald-200',
    red: 'bg-red-50 border-red-200',
    gray: 'bg-gray-50 border-gray-200',
  }
  return (
    <div className={`${colorClasses[color]} rounded-xl border p-4 flex items-center justify-between`}>
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  )
}

function StatusRow({ label, value, badgeColor }: { label: string; value: string; badgeColor: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>{value}</span>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  )
}
