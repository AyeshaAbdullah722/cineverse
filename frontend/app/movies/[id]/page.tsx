import Link from 'next/link'
import React from 'react'

type Props = { params: { id: string } }

export default async function MovieDetail({ params }: Props) {
  const id = params.id
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY
  const [movieRes, creditsRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`),
    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${key}&language=en-US`)
  ])
  const movie = await movieRes.json()
  const credits = await creditsRes.json()
  const cast = (credits.cast || []).slice(0, 8)

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <Link href="/movies" className="mb-6 inline-flex rounded-md border border-white/15 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:bg-white/5">
        ← Back
      </Link>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1c28] gold-glow">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center bg-[#111] p-6 text-center display-font text-3xl text-white/70">
              {movie.title}
            </div>
          )}
        </div>

        <div>
          <p className="display-font text-xs uppercase tracking-[0.45em] text-[#f5c518]">Movie Details</p>
          <h1 className="mt-3 display-font text-5xl tracking-[0.08em] text-white sm:text-7xl">{movie.title}</h1>
          <div className="mt-5 flex flex-wrap gap-2 text-sm text-white/70">
            <span className="rounded bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">{movie.release_date?.slice(0, 4) || 'Soon'}</span>
            <span className="rounded bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">{movie.runtime ? `${movie.runtime} min` : 'Runtime unknown'}</span>
            <span className="rounded bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">⭐ {movie.vote_average?.toFixed?.(1) || movie.vote_average || 'N/A'}</span>
            {movie.genres?.slice?.(0, 3)?.map((genre: any) => <span key={genre.id} className="rounded bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">{genre.name}</span>)}
          </div>
          <p className="mt-6 max-w-3xl text-base leading-8 text-white/75">{movie.overview}</p>

          {cast.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 display-font text-2xl tracking-[0.12em] text-white">Cast</p>
              <div className="flex flex-wrap gap-2">
                {cast.map((member: any) => (
                  <span key={member.id} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                    {member.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
