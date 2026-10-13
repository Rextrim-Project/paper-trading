export type Decimal = number

export interface PositionCalculation {
  quantity: number
  takeProfitPrice: number
  stopLossPrice: number
  expiresAt: Date
}

export interface PnlResult {
  grossPnl: number
  netPnl: number
  returnPercent: number
  totalFees: number
}

export function calculatePosition(
  capitalPerTrade: number,
  entryPrice: number,
  takeProfitPercent: number,
  stopLossPercent: number,
  positionTimeoutHours: number
): PositionCalculation {
  const quantity = capitalPerTrade / entryPrice

  const takeProfitPrice = entryPrice * (1 + takeProfitPercent / 100)
  const stopLossPrice = entryPrice * (1 + stopLossPercent / 100)

  const expiresAt = new Date(Date.now() + positionTimeoutHours * 3600 * 1000)

  return {
    quantity,
    takeProfitPrice,
    stopLossPrice,
    expiresAt,
  }
}

export function calculatePnl(
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  capitalUsed: number,
  transactionFeePercent: number,
  slippagePercent: number
): PnlResult {
  const entryFee = capitalUsed * (transactionFeePercent / 100)
  const exitValue = quantity * exitPrice
  const exitFee = exitValue * (transactionFeePercent / 100)
  const slippage = exitValue * (slippagePercent / 100)

  const totalFees = entryFee + exitFee + slippage
  const grossPnl = exitValue - capitalUsed
  const netPnl = grossPnl - totalFees
  const returnPercent = capitalUsed > 0 ? (netPnl / capitalUsed) * 100 : 0

  return {
    grossPnl,
    netPnl,
    returnPercent,
    totalFees,
  }
}

export function checkPositionClosure(
  currentPrice: number,
  takeProfitPrice: number,
  stopLossPrice: number,
  expiresAt: Date
): { shouldClose: boolean; reason?: string } {
  if (currentPrice >= takeProfitPrice) {
    return { shouldClose: true, reason: 'TAKE_PROFIT' }
  }

  if (currentPrice <= stopLossPrice) {
    return { shouldClose: true, reason: 'STOP_LOSS' }
  }

  if (new Date() >= expiresAt) {
    return { shouldClose: true, reason: 'TIMEOUT_24H' }
  }

  return { shouldClose: false }
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
