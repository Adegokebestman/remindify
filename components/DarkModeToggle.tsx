"use client"

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Switch } from "@/components/ui/switch"

export function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setDarkMode(isDarkMode)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-5 w-5" />
      <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
      <Moon className="h-5 w-5" />
    </div>
  )
}

