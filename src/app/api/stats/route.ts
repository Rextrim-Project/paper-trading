import { NextResponse } from 'next/server'

const demoStats = {
  totalAllocated: 0,
  usedCapital: 0,
  realizedPnl: 0,
  totalTrades: 0,
  openPositions: 0,
  tpCount: 0,
  slCount: 0,
  timeoutCount: 0,
  winningTrades: 0,
  losingTrades: 0,
  winRate: 0,
  mode: 'DEMO',
  settings: {
    isDemoMode: true,
    isAutoTradingEnabled: false,
    capitalPerTrade: 1000000,
    takeProfitPercent: 20,
    stopLossPercent: -10,
    positionTimeoutHours: 24,
  },
}

export async function GET() {
  return NextResponse.json(demoStats)
}
