import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const genreId = searchParams.get('genreId') || ''
  const backend = process.env.BACKEND_URL || 'http://localhost:8000'
  const url = `${backend}/movies/discover?genre_id=${encodeURIComponent(genreId)}`

  try {
    const res = await fetch(url)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (err) {
    try {
      const fallback = url.replace('localhost', '127.0.0.1')
      const res2 = await fetch(fallback)
      const data2 = await res2.json()
      return NextResponse.json(data2)
    } catch (err2: any) {
      return NextResponse.json({ error: String(err2), message: 'Failed to fetch genre movies from backend' }, { status: 502 })
    }
  }
}
