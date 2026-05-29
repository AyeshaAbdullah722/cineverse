"use client"

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { MovieCard } from '../components/MovieCard'

type Movie = {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date?: string
  vote_average?: number
}

const SECTION_CONFIG = [
  { key: 'popular', title: 'Popular on CineVerse', endpoint: 'popular' },
  { key: 'action', title: 'Action & Adventure', endpoint: 'discover/movie?with_genres=28' },
  { key: 'horror', title: 'Horror Nights', endpoint: 'discover/movie?with_genres=27' },
  { key: 'romance', title: 'Romantic Picks', endpoint: 'discover/movie?with_genres=10749' }
] as const

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [rows, setRows] = useState<Record<string, Movie[]>>({})
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

  useEffect(() => {
    async function load() {
      if (!apiKey) return

      const base = 'https://api.themoviedb.org/3'
      const heroRes = await fetch(`${base}/movie/popular?api_key=${apiKey}&language=en-US&page=1`)
      const heroJson = await heroRes.json()
      const heroMovie = heroJson.results?.[0]
      if (heroMovie) setFeaturedMovie(heroMovie)

      const entries = await Promise.all(
        SECTION_CONFIG.map(async section => {
          const res = await fetch(`${base}/${section.endpoint}${section.endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}&language=en-US&page=1`)
          const json = await res.json()
          return [section.key, json.results || []] as const
        })
      )

      setRows(Object.fromEntries(entries))
    }

    load().catch(console.error)
  }, [apiKey])

  const heroBackdrop = useMemo(() => {
    if (!featuredMovie?.backdrop_path) return ''
    return `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`
  }, [featuredMovie])

  return (
    <div className="pb-20">
      <section className="relative min-h-[92vh] overflow-hidden">
        {heroBackdrop && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-[1px]"
            style={{ backgroundImage: `url(${heroBackdrop})` }}
          />
        )}
        <div className="absolute inset-0 cinematic-gradient" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-end px-4 py-16 lg:px-8">
          <div className="max-w-2xl pb-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f5c518]/30 bg-[#f5c518]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#f5c518]">
              Trending now
            </div>
            <h1 className="display-font text-6xl leading-[0.9] tracking-[0.05em] text-white sm:text-7xl lg:text-[7.5rem]">
              {featuredMovie?.title || 'Watch something unforgettable tonight'}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              {featuredMovie?.overview || 'Discover movies, genres, and recommendations in a cinematic interface inspired by streaming platforms.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/movies" className="rounded-md bg-[#f5c518] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#e6b916]">
                Browse Movies
              </Link>
              <Link href="/genres" className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                Explore Genres
              </Link>
              {featuredMovie?.id && (
                <Link href={`/movies/${featuredMovie.id}`} className="rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5">
                  More Info
                </Link>
              )}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-white/70">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">AI Chatbot</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">TMDb powered</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Streaming-style UI</span>
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-24 space-y-10 px-4 pb-10 lg:px-8">
        {SECTION_CONFIG.map(section => (
          <MovieRail key={section.key} title={section.title} movies={rows[section.key] || []} />
        ))}
      </section>
    </div>
  )
}

function MovieRail({ title, movies }: { title: string; movies: Movie[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="display-font text-3xl tracking-[0.08em] text-white sm:text-4xl">{title}</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/25 to-transparent" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {movies.slice(0, 10).map(movie => (
          <Link key={movie.id} href={`/movies/${movie.id}`} className="min-w-[160px] max-w-[160px] sm:min-w-[190px] sm:max-w-[190px]">
            <MovieCard movie={movie} />
          </Link>
        ))}
      </div>
    </section>
  )
}