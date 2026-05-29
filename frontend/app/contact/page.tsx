import React from 'react'

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-[#f5c518]">Contact</h1>
      <p className="mt-6 text-lg text-white/85">For questions, issues or collaboration, email: <a className="text-blue-400 underline" href="mailto:hello@cineverse.example">hello@cineverse.example</a></p>

      <div className="mt-8 rounded-lg border border-white/6 bg-white/2 p-6">
        <h2 className="text-2xl font-semibold text-white">Send a message</h2>
        <p className="mt-2 text-white/80">This demo does not send messages — copy the email above to contact the project owner.</p>
      </div>
    </main>
  )
}
