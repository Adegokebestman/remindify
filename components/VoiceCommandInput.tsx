"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface VoiceCommandInputProps {
  onCommand: (command: string, params: Record<string, string>) => void
}

export function VoiceCommandInput({ onCommand }: VoiceCommandInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.lang = 'en-US'
      recognitionInstance.interimResults = false
      recognitionInstance.maxAlternatives = 1

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        parseCommand(transcript)
        setIsListening(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error)
        toast.error('Failed to recognize speech. Please try again.')
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    } else {
      toast.error('Speech recognition is not supported in this browser.')
    }
  }, [])

  const parseCommand = useCallback((transcript: string) => {
    const lowerTranscript = transcript.toLowerCase()

    // Create Reminder
    if (lowerTranscript.startsWith('create reminder') || lowerTranscript.startsWith('add reminder')) {
      const title = transcript.replace(/^(create|add) reminder/i, '').trim()
      onCommand('createReminder', { title })
    }
    // List Reminders
    else if (lowerTranscript.includes('list reminders') || lowerTranscript.includes('show reminders')) {
      onCommand('listReminders', {})
    }
    // Delete Reminder
    else if (lowerTranscript.startsWith('delete reminder') || lowerTranscript.startsWith('remove reminder')) {
      const title = transcript.replace(/^(delete|remove) reminder/i, '').trim()
      onCommand('deleteReminder', { title })
    }
    // Snooze Reminder
    else if (lowerTranscript.startsWith('snooze reminder')) {
      const title = transcript.replace(/^snooze reminder/i, '').trim()
      onCommand('snoozeReminder', { title })
    }
    // Get AI Advice
    else if (lowerTranscript.includes('get advice') || lowerTranscript.includes('ask assistant')) {
      const question = transcript.replace(/^(get advice|ask assistant)/i, '').trim()
      onCommand('getAIAdvice', { question })
    }
    else {
      toast.error('Command not recognized. Please try again.')
    }
  }, [onCommand])

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition?.stop()
    } else {
      recognition?.start()
    }
    setIsListening(!isListening)
  }, [isListening, recognition])

  return (
    <Button onClick={toggleListening} variant="outline" className="w-full">
      {isListening ? (
        <>
          <MicOff className="mr-2 h-4 w-4" /> Stop Listening
        </>
      ) : (
        <>
          <Mic className="mr-2 h-4 w-4" /> Start Voice Command
        </>
      )}
    </Button>
  )
}

