"use client"
import React, { useState } from 'react'

export function ChatWidget() {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([])
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  async function send() {
    if (!draft) return
    const userMsg = { from: 'user', text: draft }
    setMessages(m => [...m, userMsg])
    setDraft('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.text })
      })
      const j = await res.json()
      setMessages(m => [...m, { from: 'bot', text: j.answer || 'No answer' }])
    } catch (e) {
      setMessages(m => [...m, { from: 'bot', text: 'Error contacting chat backend' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl shadow-black/60 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-red-400">CineVerse AI</p>
              <p className="text-sm font-semibold text-white">Ask about movies</p>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-full px-2 py-1 text-white/70 transition hover:bg-white/10 hover:text-white">
              ×
            </button>
          </div>
          <div className="max-h-72 space-y-3 overflow-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/55">
                Ask for a movie recommendation, genre list, or what to watch tonight.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'user' ? 'ml-auto max-w-[80%] text-right' : 'mr-auto max-w-[80%]'}>
                <div
                  className={`inline-block rounded-2xl px-3 py-2 text-sm leading-6 ${
                    m.from === 'user' ? 'bg-red-600 text-white' : 'bg-white/10 text-white'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={e => setDraft(e.target.value)}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-red-500/60"
                placeholder="Type a question..."
              />
              <button onClick={send} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500" disabled={loading}>
                {loading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(v => !v)}
        className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500"
      >
        {open ? 'Close AI' : 'Ask AI'}
      </button>
    </div>
  )
}
