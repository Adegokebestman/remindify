"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast, Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { CheckCircle, Mic, Calendar, Brain, Zap, Award, ArrowRight } from 'lucide-react'

export function LandingPage() {
  const [email, setEmail] = useState('')

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    // For now, we'll just show a success message
    toast.success('You\'ve been added to the waitlist!')
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Toaster />
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">VocoRemind</div>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
              Login
            </Link>
            <Link href="/signup" passHref>
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <motion.h1
            className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Revolutionize Your Productivity
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            VocoRemind: The AI-powered voice reminder app that transforms your task management
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/signup" passHref>
              <Button size="lg" className="text-lg px-8 py-4 rounded-full">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            { icon: <Mic className="w-12 h-12 text-blue-500" />, title: "Voice-Activated Reminders", description: "Set reminders effortlessly using your voice, making task creation quick and hands-free." },
            { icon: <Brain className="w-12 h-12 text-purple-500" />, title: "AI-Powered Assistant", description: "Get personalized productivity advice and task suggestions from our intelligent AI assistant." },
            { icon: <Calendar className="w-12 h-12 text-green-500" />, title: "Smart Scheduling", description: "Optimize your day with intelligent scheduling that adapts to your preferences and habits." },
            { icon: <Zap className="w-12 h-12 text-yellow-500" />, title: "Habit Tracking", description: "Build and maintain positive habits with our integrated habit tracking system." },
            { icon: <CheckCircle className="w-12 h-12 text-red-500" />, title: "Task Integration", description: "Seamlessly import tasks from popular platforms like Trello, Asana, and Jira." },
            { icon: <Award className="w-12 h-12 text-indigo-500" />, title: "Gamified Productivity", description: "Level up your productivity with gamification elements that make task completion rewarding." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard {...feature} />
            </motion.div>
          ))}
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Join Our Exclusive Waitlist</h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Be among the first to experience the future of productivity
          </p>
          <form onSubmit={handleWaitlistSubmit} className="flex justify-center">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-64 mr-2"
              required
            />
            <Button type="submit">Join Waitlist</Button>
          </form>
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your Productivity?</h2>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            Join thousands of users who have transformed their task management with VocoRemind
          </p>
          <Link href="/signup" passHref>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-full">
              Start Your Free Trial
            </Button>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2023 VocoRemind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

