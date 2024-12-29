"use client"
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { SessionProvider } from "next-auth/react"
import ErrorBoundary from '@/components/ErrorBoundary'
import { ThemeProvider } from "@/components/theme-provider"
const inter = Inter({ subsets: ['latin'] })

// export const metadata = {
//   title: 'VocoRemind',
//   description: 'Your voice, your reminder. Personalized for every moment.',
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SessionProvider>
        </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

