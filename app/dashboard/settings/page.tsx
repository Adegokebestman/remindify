"use client"

import { UserSettings } from '@/components/UserSettings'

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <UserSettings />
    </div>
  )
}

