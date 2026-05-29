"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MovieCard } from '../../components/MovieCard'

const GENRES = [
  { id: 28, name: 'Action & Adventure' },
  { id: 27, name: 'Horror' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 10749, name: 'Romance' }
]

export default function GenresPage() {
  const [selected, setSelected] = useState<number>(27)
  const [movies, setMovies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setError(null)
      setLoading(true)
      try {
        const res = await fetch(`/api/genres?genreId=${selected}`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`Server responded ${res.status}: ${text}`)
        }
        const json = await res.json()
        setMovies(json.results || [])
      } catch (e: any) {
        console.error('genres load error', e)
        setError(e.message || 'Unknown error')
        setMovies([])
      } finally {
        setLoading(false)
      }
    }
    load().catch(() => setLoading(false))
  }, [selected])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div>
          <p className="display-font text-xs uppercase tracking-[0.45em] text-[#f5c518]">Genres</p>
          <h1 className="mt-3 display-font text-5xl tracking-[0.08em] text-white sm:text-7xl">Pick a mood and start watching</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          {GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selected === g.id ? 'bg-[#f5c518] text-black shadow-lg shadow-[#f5c518]/20' : 'bg-white/10 text-white/75 hover:bg-white/15 hover:text-white'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
        {error && <p className="text-sm text-red-300">Error: {error}</p>}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-white/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {!movies.length && <p className="col-span-full text-white/60">No genre movies found yet.</p>}
          {movies.map(m => (
            <Link key={m.id} href={`/movies/${m.id}`}>
              <MovieCard movie={m} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}