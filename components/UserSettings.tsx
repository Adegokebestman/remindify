"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface UserSettings {
  userId: string
  theme: 'light' | 'dark'
  timezone: string
  notificationPreference: 'email' | 'push' | 'both'
}

export function UserSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings | null>(null)

  useEffect(() => {
    if (user) {
      fetchSettings()
    }
  }, [user])

  const fetchSettings = async () => {
    const response = await fetch(`/api/user-settings?userId=${user?.id}`)
    const data = await response.json()
    setSettings(data)
  }

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    const response = await fetch('/api/user-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSettings),
    })
    const data = await response.json()
    setSettings(data)
    toast.success('Settings updated successfully!')
  }

  if (!settings) return null

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Settings</h2>
      <div>
        <label className="block mb-2">Theme</label>
        <Select
          value={settings.theme}
          onValueChange={(value) => updateSettings({ theme: value as 'light' | 'dark' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-2">Timezone</label>
        <Select
          value={settings.timezone}
          onValueChange={(value) => updateSettings({ timezone: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="America/New_York">Eastern Time</SelectItem>
            <SelectItem value="America/Chicago">Central Time</SelectItem>
            <SelectItem value="America/Denver">Mountain Time</SelectItem>
            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="block mb-2">Notification Preference</label>
        <Select
          value={settings.notificationPreference}
          onValueChange={(value) => updateSettings({ notificationPreference: value as 'email' | 'push' | 'both' })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select notification preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="push">Push</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

