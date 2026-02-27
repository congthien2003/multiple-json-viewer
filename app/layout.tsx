import React from "react"
import type { Metadata } from 'next'
import { Open_Sans, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProvider } from '@/contexts/AppContext'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const openSans = Open_Sans({ subsets: ["latin"], variable: '--font-sans' });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const poppins = { variable: '--font-poppins' }; // Declaring the poppins variable

export const metadata: Metadata = {
  title: 'JSON Viewer',
  description: 'Advanced JSON Viewer with multiple themes and tabs',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${openSans.variable}`}>
      <body className={`font-sans antialiased`}>
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2200,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.12)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
