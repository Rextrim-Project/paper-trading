import { NextResponse } from 'next/server'

const demoPositions: any[] = []

export async function GET() {
  return NextResponse.json(demoPositions)
}
