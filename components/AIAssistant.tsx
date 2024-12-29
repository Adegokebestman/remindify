"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from '@/contexts/AuthContext'
import { Volume2, VolumeX } from 'lucide-react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export function AIAssistant() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dailySuggestion, setDailySuggestion] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const { user } = useAuth()
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis
    }
    if (user?.id) {
      fetchDailySuggestion()
    }
  }, [user])

  const fetchDailySuggestion = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/ai-assistant/daily-suggestion?userId=${user.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch daily suggestion')
      }
      const data = await response.json()
      setDailySuggestion(data.suggestion)
    } catch (error) {
      console.error('Error fetching daily suggestion:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user?.id) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, userId: user.id }),
      })
      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }
      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.reply }
      setMessages(prev => [...prev, assistantMessage])
      speakMessage(data.reply)
    } catch (error) {
      console.error('Error sending message to AI Assistant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const speakMessage = (message: string) => {
    if (speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.current.speak(utterance)
    }
  }

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechSynthesis.current?.cancel()
      setIsSpeaking(false)
    } else {
      const lastAssistantMessage = messages.findLast(m => m.role === 'assistant')
      if (lastAssistantMessage) {
        speakMessage(lastAssistantMessage.content)
      }
    }
  }

  if (!user) {
    return <div>Please log in to use the AI Assistant.</div>
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
        <CardDescription>Get personalized productivity advice and motivation</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4 p-4 border rounded-md">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'assistant' ? 'text-blue-600' : 'text-gray-800'}`}>
              <strong>{message.role === 'assistant' ? 'AI: ' : 'You: '}</strong>
              {message.content}
            </div>
          ))}
          {isLoading && <div className="text-gray-500">AI is thinking...</div>}
        </ScrollArea>
        {dailySuggestion && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Daily Suggestion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{dailySuggestion}</p>
            </CardContent>
          </Card>
        )}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for advice or motivation..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>Send</Button>
          <Button type="button" variant="outline" onClick={toggleSpeech}>
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

