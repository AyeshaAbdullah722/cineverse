import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const backend = process.env.BACKEND_URL || 'http://localhost:8000'

  try {
    const res = await fetch(`${backend}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    // Retry with IPv4 localhost address if backend isn't reachable via ::1
    try {
      const fallbackBase = backend.replace('localhost', '127.0.0.1')
      const res2 = await fetch(`${fallbackBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data2 = await res2.json()
      return NextResponse.json(data2)
    } catch (err2: any) {
      return NextResponse.json({ error: String(err2), message: 'Failed to reach backend chat endpoint' }, { status: 502 })
    }
  }
}
