"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Moon, Sun } from 'lucide-react'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDarkMode)
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            VocoRemind
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Link href="/pricing" className="mr-4">
              Pricing
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="mr-4">
                  Dashboard
                </Link>
                <Button onClick={logout} variant="destructive">
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={login}>
                Login
              </Button>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <footer className="bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 text-center text-gray-600 dark:text-gray-400">
          © 2023 VocoRemind. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

