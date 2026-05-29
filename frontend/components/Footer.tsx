import React from 'react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0f] px-4 py-8 text-center text-sm text-white/45">
      <div className="mx-auto max-w-7xl">
        <p className="display-font text-2xl tracking-[0.45em] text-[#f5c518] uppercase">CineVerse</p>
        <p className="mt-3">{new Date().getFullYear()} · A cinematic movie discovery experience.</p>
      </div>
    </footer>
  )
}
