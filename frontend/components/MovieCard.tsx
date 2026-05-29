import React from 'react'

export function MovieCard({ movie }: { movie: any }) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : '/placeholder.png'

  return (
    <div className="group relative overflow-hidden rounded-[var(--radius)] border border-white/10 bg-[#1c1c28] transition duration-300 hover:-translate-y-1 hover:border-[#f5c518]/40 hover:shadow-2xl hover:shadow-black/40">
      <div className="relative aspect-[2/3] overflow-hidden bg-[#111111]">
        <img
          src={poster}
          alt={movie.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5c518]/10 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="flex items-center justify-between gap-2 text-xs text-white/80">
            <span className="rounded bg-[#f5c518] px-2 py-1 font-semibold uppercase tracking-widest text-black">Top</span>
            <span>{movie.release_date?.slice(0, 4) || 'Soon'}</span>
          </div>
          <h3 className="mt-2 max-h-10 overflow-hidden text-sm font-semibold text-white">{movie.title}</h3>
        </div>
      </div>
    </div>
  )
}
