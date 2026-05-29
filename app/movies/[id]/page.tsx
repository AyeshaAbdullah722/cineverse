import React from 'react'

type Props = { params: { id: string } }

export default async function MovieDetail({ params }: Props) {
  const id = params.id
  const key = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${key}`)
  const movie = await res.json()

  return (
    <article>
      <h1 className="text-3xl font-bold">{movie.title}</h1>
      <p className="mt-2 text-slate-600">{movie.overview}</p>
    </article>
  )
}
