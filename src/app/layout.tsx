import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Hello World',
  description: 'A simple Next.js Hello World application',
  keywords: 'nextjs, solana, blockchain, web3',
  openGraph: {
    title: 'Next.js Hello World',
    description: 'A simple Next.js Hello World application with Solana integration',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Hello World',
    description: 'A simple Next.js Hello World application with Solana integration',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
