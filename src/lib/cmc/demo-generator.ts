const TOP_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', basePrice: 95000000 },
  { symbol: 'ETH', name: 'Ethereum', basePrice: 4200000 },
  { symbol: 'SOL', name: 'Solana', basePrice: 1800000 },
  { symbol: 'BNB', name: 'BNB', basePrice: 7500000 },
  { symbol: 'XRP', name: 'Ripple', basePrice: 6500 },
  { symbol: 'ADA', name: 'Cardano', basePrice: 6800 },
  { symbol: 'DOGE', name: 'Dogecoin', basePrice: 180 },
  { symbol: 'AVAX', name: 'Avalanche', basePrice: 420000 },
  { symbol: 'LINK', name: 'Chainlink', basePrice: 150000 },
  { symbol: 'MATIC', name: 'Polygon', basePrice: 9500 },
]

const BUY_REASONINGS = [
  'Strong bullish momentum detected with increasing volume',
  'Technical analysis shows breakout above key resistance level',
  'Positive sentiment from recent developments and partnerships',
  'RSI indicates oversold conditions with recovery potential',
  'Accumulation pattern observed with institutional buying pressure',
]

export function generateDemoRecommendations(count: number = 3) {
  const recommendations = []
  const usedIndices = new Set<number>()

  for (let i = 0; i < count; i++) {
    let coinIndex
    do {
      coinIndex = Math.floor(Math.random() * TOP_COINS.length)
    } while (usedIndices.has(coinIndex))
    usedIndices.add(coinIndex)

    const coin = TOP_COINS[coinIndex]
    const priceVariation = 0.95 + Math.random() * 0.1
    const confidence = 0.65 + Math.random() * 0.3
    const reasoning = BUY_REASONINGS[Math.floor(Math.random() * BUY_REASONINGS.length)]

    recommendations.push({
      source: 'DEMO',
      coinSymbol: coin.symbol,
      coinName: coin.name,
      currentPrice: coin.basePrice * priceVariation,
      recommendation: 'BUY',
      confidence: parseFloat(confidence.toFixed(2)),
      reasoning,
      fetchedAt: new Date(),
    })
  }

  return recommendations
}

export function generateDemoPrice(symbol: string): number {
  const coin = TOP_COINS.find(c => c.symbol === symbol.toUpperCase())
  if (!coin) return 1000

  const variation = 0.9 + Math.random() * 0.2
  return coin.basePrice * variation
}
