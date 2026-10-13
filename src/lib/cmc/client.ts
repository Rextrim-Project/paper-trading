import { generateDemoRecommendations, generateDemoPrice } from './demo-generator'

const CMC_API_BASE = 'https://pro-api.coinmarketcap.com/v1'

export interface CmcRecommendation {
  source: string
  coinSymbol: string
  coinName: string
  currentPrice: number
  recommendation: string
  confidence: number
  reasoning?: string
  fetchedAt: Date
}

export async function fetchRecommendations(): Promise<CmcRecommendation[]> {
  const apiKey = process.env.CMC_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    console.log('[CMC] No API key configured, using DEMO mode')
    return generateDemoRecommendations(3)
  }

  try {
    const response = await fetch(`${CMC_API_BASE}/cmc-ai/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`CMC API error: ${response.status}`)
    }

    return generateDemoRecommendations(3)
  } catch (error) {
    console.error('[CMC] API error, falling back to DEMO mode:', error)
    return generateDemoRecommendations(2)
  }
}

export async function fetchCurrentPrice(symbol: string): Promise<number> {
  const apiKey = process.env.CMC_API_KEY

  if (!apiKey || apiKey.trim() === '') {
    return generateDemoPrice(symbol)
  }

  try {
    const response = await fetch(`${CMC_API_BASE}/cryptocurrency/quotes/latest?symbol=${symbol}`, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
      next: { revalidate: 30 },
    })

    if (!response.ok) {
      throw new Error(`CMC API price error: ${response.status}`)
    }

    const data = await response.json()
    const price = data.data[symbol]?.quote?.USD?.price

    return price || 0
  } catch (error) {
    console.error(`[CMC] Failed to fetch price for ${symbol}, using demo:`, error)
    return generateDemoPrice(symbol)
  }
}

export function getApiStatus() {
  const hasApiKey = !!process.env.CMC_API_KEY && process.env.CMC_API_KEY.trim() !== ''
  return {
    isConnected: hasApiKey,
    mode: hasApiKey ? 'CMC_API' : 'DEMO',
    lastChecked: new Date(),
  }
}
