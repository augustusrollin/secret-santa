import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Secret Santa 2025',
  description: 'A festive Secret Santa gift exchange app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

