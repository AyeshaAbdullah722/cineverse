import './globals.css'
import React from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ChatWidget } from '../components/ChatWidget'

export const metadata = {
  title: 'CineVerse',
  description: 'Stream movie discovery with a Netflix-inspired cinematic UI'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </div>
        <ChatWidget />
      </body>
    </html>
  )
}
