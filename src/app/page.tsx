'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
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
    return <div className="p-8">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Crypto Paper Trading</h1>
            <p className="text-gray-600 mt-1">Dashboard Analitik Performa Trading</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${stats?.mode === 'DEMO' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
              {stats?.mode} MODE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <StatCard label="Total Dialokasikan" value={formatRupiah(stats?.totalAllocated || 0)} />
          <StatCard label="Modal Digunakan" value={formatRupiah(stats?.usedCapital || 0)} />
          <StatCard label="Realized P&L" value={formatRupiah(stats?.realizedPnl || 0)} positive={(stats?.realizedPnl || 0) >= 0} />
          <StatCard label="Total Transaksi" value={`${stats?.totalTrades || 0}`} />
          <StatCard label="Posisi Aktif" value={`${stats?.openPositions || 0}`} />
          <StatCard label="Win Rate" value={`${(stats?.winRate || 0).toFixed(1)}%`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard label="Take Profit" value={`${stats?.tpCount || 0}`} labelColor="text-green-600" />
          <StatCard label="Stop Loss" value={`${stats?.slCount || 0}`} labelColor="text-red-600" />
          <StatCard label="Timeout 24h" value={`${stats?.timeoutCount || 0}`} labelColor="text-gray-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/positions" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Posisi Aktif
              </Link>
              <Link href="/history" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Riwayat Trading
              </Link>
              <Link href="/settings" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Pengaturan
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Status Sistem</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Auto Trading</span>
                <span className={stats?.settings?.isAutoTradingEnabled ? 'text-green-600' : 'text-gray-500'}>
                  {stats?.settings?.isAutoTradingEnabled ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TP Target</span>
                <span>+{stats?.settings?.takeProfitPercent || 20}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SL Batas</span>
                <span>{stats?.settings?.stopLossPercent || -10}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Modal per Trade</span>
                <span>{formatRupiah(stats?.settings?.capitalPerTrade || 1000000)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, positive, labelColor }: { label: string; value: string; positive?: boolean; labelColor?: string }) {
  const valueColor = positive === true ? 'text-green-600' : positive === false ? 'text-red-600' : 'text-gray-900'
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className={`text-xs font-medium ${labelColor || 'text-gray-500'} mb-1`}>{label}</p>
      <p className={`text-lg font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}
