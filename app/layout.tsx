import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const geist = Geist({ subsets: ['latin'], display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'EasyAcre',
  description: 'Explore real estate markets across the most dynamic cities with comprehensive property news, investment insights, and AI-powered analysis.',
  generator: 'v0.app',
  icons: {
    icon: '/easyacre-logo.svg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${geist.className} antialiased`}>{children}</body>
    </html>
  )
}
