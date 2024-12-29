"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'react-hot-toast'

const calendarProviders = [
  { id: 'google', name: 'Google Calendar' },
  { id: 'outlook', name: 'Outlook Calendar' },
  { id: 'apple', name: 'Apple Calendar' },
]

export function CalendarIntegration() {
  const [selectedProvider, setSelectedProvider] = useState('')

  const handleConnect = async () => {
    if (!selectedProvider) {
      toast.error('Please select a calendar provider')
      return
    }

    try {
      // Here you would typically initiate the OAuth flow for the selected provider
      // For demonstration purposes, we'll just show a success message
      toast.success(`Connected to ${selectedProvider} successfully!`)
    } catch (error) {
      console.error('Error connecting to calendar:', error)
      toast.error('Failed to connect to calendar')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Integration</CardTitle>
        <CardDescription>Connect your external calendar to sync reminders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger>
            <SelectValue placeholder="Select a calendar provider" />
          </SelectTrigger>
          <SelectContent>
            {calendarProviders.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
        <Button onClick={handleConnect}>Connect Calendar</Button>
      </CardFooter>
    </Card>
  )
}

