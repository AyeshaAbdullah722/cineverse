"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MovieCard } from '../../components/MovieCard'

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [q, setQ] = useState('batman')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchMovies(query: string) {
    setError(null)
    try {
      setLoading(true)
      const res = await fetch(`/api/movies?query=${encodeURIComponent(query)}`)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Server responded ${res.status}: ${text}`)
      }
      const json = await res.json()
      setMovies(json.results || [])
    } catch (e: any) {
      console.error('fetchMovies error', e)
      setError(e.message || 'Unknown error')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(q)
  }, [q])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#f5c518]/10 via-black to-black p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="display-font text-xs uppercase tracking-[0.45em] text-[#f5c518]">Browse all titles</p>
        <h1 className="mt-3 display-font text-5xl tracking-[0.08em] text-white sm:text-7xl">All Movies</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
          Search any movie title and explore it in a dark, cinematic layout inspired by the visual reference.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-black/60 px-4 py-3 text-white outline-none placeholder:text-white/35 focus:border-[#f5c518]/60"
            placeholder="Search movies..."
          />
          <button
            onClick={() => fetchMovies(q)}
            className="rounded-lg bg-[#f5c518] px-5 py-3 font-semibold text-black transition hover:bg-[#e6b916]"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && <p className="mt-4 text-sm text-red-300">Error: {error}</p>}
      </div>

      {loading && <p className="text-white/70">Loading movies…</p>}
      {!loading && movies.length === 0 && (
        <p className="text-white/60">No movies found. Try a different search or check the API proxy.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map(m => (
          <Link key={m.id} href={`/movies/${m.id}`}>
            <MovieCard movie={m} />
          </Link>
        ))}
      </div>
    </div>
  )
}