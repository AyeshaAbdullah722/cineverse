import React from 'react'

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#f5c518]">About CineVerse</h1>
      <p className="mt-6 text-lg text-white/85">
        CineVerse is a demo movie explorer built with Next.js, Tailwind CSS and a small FastAPI backend for RAG/chat features. Browse movies, explore genres, and ask the chat widget for recommendations.
      </p>
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-white">Project</h2>
        <p className="text-white/80">This project demonstrates a full-stack pattern: Next.js frontend with server/client components and API routes, plus a Python FastAPI backend for third-party integrations and RAG logic.</p>
        <h2 className="text-2xl font-semibold text-white mt-4">Contribute</h2>
        <p className="text-white/80">See the repository for setup instructions and environment variables. If you want the backend hosted, set the `BACKEND_URL` environment variable to your deployment.</p>
      </section>
    </main>
  )
}
