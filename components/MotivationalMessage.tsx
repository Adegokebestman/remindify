"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MotivationalMessage() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchMotivationalMessage = async () => {
      try {
        const response = await fetch('/api/motivational-message')
        const data = await response.json()
        setMessage(data.message)
      } catch (error) {
        console.error('Error fetching motivational message:', error)
      }
    }

    fetchMotivationalMessage()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Motivation</CardTitle>
        <CardDescription>Your dose of inspiration for the day</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{message}</p>
      </CardContent>
    </Card>
  )
}

