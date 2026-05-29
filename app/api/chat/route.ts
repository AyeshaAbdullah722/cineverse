import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const backend = process.env.BACKEND_URL || 'http://localhost:8000'
  const res = await fetch(`${backend}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  return NextResponse.json(data)
}
