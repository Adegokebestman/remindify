"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Mic, Calendar, Brain, Zap, Award } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { updateUser } = useAuth()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete();
  }

  const handleSkip = () => {
    onComplete();
  }

  const steps = [
    {
      title: "Welcome to VocoRemind",
      description: "Let's get you started with your personal voice-activated reminder system.",
      icon: <Mic className="w-12 h-12 text-primary" />,
    },
    {
      title: "Voice-Activated Reminders",
      description: "Set reminders effortlessly using your voice. Just click the microphone icon and speak.",
      icon: <Calendar className="w-12 h-12 text-primary" />,
    },
    {
      title: "AI-Powered Assistant",
      description: "Get personalized productivity advice and task suggestions from our intelligent AI assistant.",
      icon: <Brain className="w-12 h-12 text-primary" />,
    },
    {
      title: "Habit Tracking",
      description: "Build and maintain positive habits with our integrated habit tracking system.",
      icon: <Zap className="w-12 h-12 text-primary" />,
    },
    {
      title: "Gamified Productivity",
      description: "Level up your productivity with gamification elements that make task completion rewarding.",
      icon: <Award className="w-12 h-12 text-primary" />,
    },
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Welcome to VocoRemind</CardTitle>
        <CardDescription>Let's get you started with a quick tour of our key features</CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            {steps[currentStep].icon}
            <h3 className="text-2xl font-bold mt-4">{steps[currentStep].title}</h3>
            <p className="mt-2 text-muted-foreground">{steps[currentStep].description}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center mt-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${
                index === currentStep ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handlePrevious} disabled={currentStep === 0} variant="outline">
          Previous
        </Button>
        <Button onClick={handleSkip} variant="ghost">
          Skip Tour
        </Button>
        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </CardFooter>
    </Card>
  )
}

