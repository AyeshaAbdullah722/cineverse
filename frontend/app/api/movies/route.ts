import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const backend = process.env.BACKEND_URL || 'http://localhost:8000'
  const url = `${backend}/movies/search?query=${encodeURIComponent(query)}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    // Retry using 127.0.0.1 in case localhost resolved to IPv6 ::1 and backend is listening on IPv4 only
    try {
      const fallback = url.replace('localhost', '127.0.0.1')
      const res2 = await fetch(fallback)
      const data2 = await res2.json()
      return NextResponse.json(data2)
    } catch (err2: any) {
      return NextResponse.json({ error: String(err2), message: 'Failed to fetch from backend' }, { status: 502 })
    }
  }
}
