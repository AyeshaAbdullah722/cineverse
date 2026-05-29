import Link from 'next/link'
import React from 'react'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0fdd] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-red-600 uppercase">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-red-600 text-sm font-black text-white shadow-lg shadow-red-600/30">C</span>
          <span className="display-font text-3xl tracking-[0.3em] text-[#f5c518]">CineVerse</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-white/75">
          <Link href="/" className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white">Home</Link>
          <Link href="/movies" className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white">Movies</Link>
          <Link href="/genres" className="rounded-md px-3 py-2 transition hover:bg-white/10 hover:text-white">Genres</Link>
          <Link href="/about" className="hidden rounded-md border border-white/10 px-3 py-2 text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:inline-flex">
            About
          </Link>
          <Link href="/contact" className="hidden rounded-md border border-white/10 px-3 py-2 text-white/70 transition hover:border-white/20 hover:bg-white/5 hover:text-white sm:inline-flex">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}
