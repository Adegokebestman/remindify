"use client"

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { toast } from 'react-hot-toast'
import { Play, Pause, RotateCcw, Mic, MicOff } from 'lucide-react'

const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60

export function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME)
  const [isActive, setIsActive] = useState(false)
  const [isWork, setIsWork] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event) => {
        const last = event.results.length - 1
        const command = event.results[last][0].transcript.toLowerCase()

        if (command.includes('start') || command.includes('begin')) {
          startTimer()
        } else if (command.includes('stop') || command.includes('pause')) {
          pauseTimer()
        } else if (command.includes('reset')) {
          resetTimer()
        }
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  useEffect(() => {
    if (timeLeft === 0) {
      if (isWork) {
        toast.success("Work session complete! Take a break.")
        setTimeLeft(BREAK_TIME)
        setIsWork(false)
      } else {
        toast.success("Break time over! Back to work.")
        setTimeLeft(WORK_TIME)
        setIsWork(true)
      }
      setIsActive(false)
    }
  }, [timeLeft, isWork])

  const startTimer = () => {
    setIsActive(true)
    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1)
    }, 1000)
  }

  const pauseTimer = () => {
    setIsActive(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  const resetTimer = () => {
    pauseTimer()
    setTimeLeft(isWork ? WORK_TIME : BREAK_TIME)
  }

  const toggleVoiceControl = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      recognitionRef.current?.start()
    }
    setIsListening(!isListening)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      isActive ? pauseTimer() : startTimer()
    } else if (e.key === 'r') {
      resetTimer()
    } else if (e.key === 'v') {
      toggleVoiceControl()
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold" aria-live="polite">{formatTime(timeLeft)}</h2>
          <p className="text-xl mt-2" aria-live="polite">{isWork ? 'Work' : 'Break'}</p>
        </div>
        <Slider
          value={[timeLeft]}
          max={isWork ? WORK_TIME : BREAK_TIME}
          step={1}
          onValueChange={(value) => setTimeLeft(value[0])}
          disabled={isActive}
          aria-label="Timer progress"
        />
        <div className="flex justify-center space-x-2">
          <Button
            onClick={isActive ? pauseTimer : startTimer}
            onKeyDown={handleKeyDown}
            aria-label={isActive ? "Pause timer" : "Start timer"}
          >
            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button
            onClick={resetTimer}
            onKeyDown={handleKeyDown}
            variant="outline"
            aria-label="Reset timer"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={toggleVoiceControl}
            onKeyDown={handleKeyDown}
            variant="outline"
            aria-label={isListening ? "Disable voice control" : "Enable voice control"}
          >
            {isListening ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {isListening ? 'Disable' : 'Enable'} Voice Control
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

