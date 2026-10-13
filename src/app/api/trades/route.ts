import { NextResponse } from 'next/server'

const demoTrades: any[] = []

export async function GET() {
  return NextResponse.json(demoTrades)
}
