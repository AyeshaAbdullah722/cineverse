import React from 'react'
import Link from 'next/link'

export default function Home() {
  return (
    <section>
      <header className="py-12 text-center">
        <h1 className="text-4xl font-bold">CineVerse</h1>
        <p className="mt-4 text-slate-600">Discover movies and ask our AI assistant for recommendations.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/movies" className="px-4 py-2 bg-indigo-600 text-white rounded">Browse Movies</Link>
          <Link href="/about" className="px-4 py-2 border border-slate-200 rounded">About</Link>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Featured</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border rounded">Featured movie placeholder</div>
          <div className="p-4 border rounded">Featured movie placeholder</div>
          <div className="p-4 border rounded">Featured movie placeholder</div>
        </div>
      </section>
    </section>
  )
}
