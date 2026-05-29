"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MovieCard } from '../../components/MovieCard'

export default function MoviesPage() {
  const [movies, setMovies] = useState<any[]>([])
  const [q, setQ] = useState('batman')

  useEffect(() => {
    async function load() {
      try {
        const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&api_key=${key}`)
        const json = await res.json()
        setMovies(json.results || [])
      } catch (e) {
        console.error(e)
      }
    }
    load()
  }, [q])

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <input value={q} onChange={e => setQ(e.target.value)} className="border p-2 rounded flex-1" />
        <button onClick={() => {}} className="px-3 py-2 bg-indigo-600 text-white rounded">Search</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {movies.map(m => (
          <Link key={m.id} href={`/movies/${m.id}`}>
            <MovieCard movie={m} />
          </Link>
        ))}
      </div>
    </div>
  )
}
