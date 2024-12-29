"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { ReminderList } from '@/components/ReminderList'
import { MotivationalMessage } from '@/components/MotivationalMessage'
import { AIAssistant } from '@/components/AIAssistant'
import { VoiceCommandInput } from '@/components/VoiceCommandInput'
import { DashboardOverview } from '@/components/DashboardOverview'
import { ReminderCalendar } from '@/components/ReminderCalendar'
import { ProductivityTracker } from '@/components/ProductivityTracker'
import { SmartSuggestions } from '@/components/SmartSuggestions'
import { HabitTracker } from '@/components/HabitTracker'
import { Gamification } from '@/components/Gamification'
import { TaskIntegration } from '@/components/TaskIntegration'
import { Reminder } from '@/types/reminder'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Onboarding } from '@/components/Onboarding'
import { updateUser } from '@/lib/user' // Import updateUser function


export default function Dashboard() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [filteredReminders, setFilteredReminders] = useState<Reminder[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  // const [showOnboarding, setShowOnboarding] = useState(true) // Updated initial state
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const aiAssistantRef = useRef<{ askQuestion: (question: string) => void } | null>(null)
  const { user } = useAuth()
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchReminders()
    }
  }, [status, router])

  useEffect(() => {
    const filtered = reminders.filter(reminder =>
      reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reminder.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredReminders(filtered)
  }, [searchTerm, reminders])

  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date()
      reminders.forEach(reminder => {
        const reminderTime = new Date(`${reminder.date}T${reminder.time}`)
        if (now >= reminderTime && now.getTime() - reminderTime.getTime() < 60000) {
          showNotification(reminder)
        }
      })
    }, 60000) // Check every minute

    return () => clearInterval(checkReminders)
  }, [reminders])

  // useEffect(() => {
  //   if (user) {
  //     setShowOnboarding(!user.onboardingCompleted) // Updated useEffect
  //   }
  // }, [user])

  const fetchReminders = async () => {
    try {
      const response = await fetch(`/api/reminders?userId=${user?.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reminders')
      }
      const data = await response.json()
      setReminders(data)
    } catch (error) {
      console.error('Error fetching reminders:', error)
      toast.error('Failed to load reminders')
    }
  }

  const createReminder = async (reminder: Partial<Reminder>) => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reminder, userId: user?.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create reminder');
      }
      const data = await response.json();
      setReminders([...reminders, data]);
      toast.success('Reminder created successfully!');
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to create reminder: ' + (error as Error).message);
    }
  };

  const updateReminder = async (reminder: Reminder) => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminder),
      });
      if (!response.ok) {
        throw new Error('Failed to update reminder')
      }
      const data = await response.json();
      setReminders(reminders.map(r => r.id === data.id ? data : r));
      toast.success('Reminder updated successfully!')
    } catch (error) {
      console.error('Error updating reminder:', error)
      toast.error('Failed to update reminder')
    }
  }

  const deleteReminder = async (id: string) => {
    try {
      const response = await fetch(`/api/reminders?id=${id}&userId=${user?.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete reminder')
      }
      setReminders(reminders.filter(r => r.id !== id))
      toast.success('Reminder deleted successfully!')
    } catch (error) {
      console.error('Error deleting reminder:', error)
      toast.error('Failed to delete reminder')
    }
  }

  const handleSnooze = async (reminder: Reminder) => {
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 5 * 60000); // Snooze for 5 minutes from now
    const updatedReminder = {
      ...reminder,
      date: snoozeTime.toISOString().split('T')[0],
      time: snoozeTime.toTimeString().split(' ')[0].slice(0, 5)
    };

    setReminders(reminders.map(r => r.id === reminder.id ? updatedReminder : r));
    await updateReminder(updatedReminder);

    const formattedTime = snoozeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    toast.success(`Reminder snoozed until ${formattedTime}`);
  };

  const playSound = (sound: string) => {
    if (audioRef.current) {
      audioRef.current.src = sound
      audioRef.current.play()
    }
  }

  const showNotification = (reminder: Reminder) => {
    if (Notification.permission === "granted") {
      new Notification(reminder.title, {
        body: `It's time for your ${reminder.category} reminder!`,
        icon: '/icon.png'
      })
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showNotification(reminder)
        }
      })
    }
    playSound(reminder.sound)
  }

  const handleVoiceCommand = useCallback((command: string, params: Record<string, string>) => {
    switch (command) {
      case 'createReminder':
        createReminder({
          title: params.title,
          category: 'General',
          tags: [],
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].slice(0, 5),
          recurring: 'none',
          sound: ''
        })
        break
      case 'listReminders':
        setActiveTab('reminders')
        toast.success('Showing all reminders')
        break
      case 'deleteReminder':
        const reminderToDelete = reminders.find(r => r.title.toLowerCase() === params.title.toLowerCase())
        if (reminderToDelete) {
          deleteReminder(reminderToDelete.id)
        } else {
          toast.error(`Reminder "${params.title}" not found`)
        }
        break
      case 'snoozeReminder':
        const reminderToSnooze = reminders.find(r => r.title.toLowerCase() === params.title.toLowerCase())
        if (reminderToSnooze) {
          handleSnooze(reminderToSnooze)
        } else {
          toast.error(`Reminder "${params.title}" not found`)
        }
        break
      case 'getAIAdvice':
        setActiveTab('ai-assistant')
        if (aiAssistantRef.current) {
          aiAssistantRef.current.askQuestion(params.question)
        } else {
          toast.error('AI Assistant is not ready. Please try again.')
        }
        break
      default:
        toast.error('Command not recognized. Please try again.')
    }
  }, [reminders, createReminder, deleteReminder, handleSnooze])

  // const handleOnboardingComplete = useCallback(async () => {
  //   try {
  //     await updateUser({ onboardingCompleted: true })
  //     setShowOnboarding(false)
  //   } catch (error) {
  //     console.error('Failed to update user onboarding status:', error)
  //     toast.error('Failed to complete onboarding. Please try again.')
  //   }
  // }, [updateUser])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="space-y-4">
      {/* {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : ( */}
        <>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <MotivationalMessage />
          <VoiceCommandInput onCommand={handleVoiceCommand} />
          <Input
            type="text"
            placeholder="Search reminders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="productivity">Productivity</TabsTrigger>
              <TabsTrigger value="habits">Habits</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-4">
                <DashboardOverview reminders={reminders} />
              </div>
            </TabsContent>
            <TabsContent value="reminders">
              <ReminderList
                reminders={filteredReminders}
                onAddReminder={createReminder}
                onUpdateReminder={updateReminder}
                onDeleteReminder={deleteReminder}
                onSnoozeReminder={handleSnooze}
              />
            </TabsContent>
            <TabsContent value="calendar">
              <ReminderCalendar reminders={reminders} />
            </TabsContent>
            <TabsContent value="productivity">
              <ProductivityTracker reminders={reminders} />
            </TabsContent>
            <TabsContent value="habits">
              <HabitTracker />
            </TabsContent>
            <TabsContent value="integrations">
              <TaskIntegration />
            </TabsContent>
            <TabsContent value="ai-assistant">
              <AIAssistant ref={aiAssistantRef} />
            </TabsContent>
          </Tabs>
          <SmartSuggestions reminders={reminders} onAddReminder={createReminder} />
                <Gamification completedReminders={reminders.filter(r => new Date(`${r.date}T${r.time}`) < new Date()).length} />
          <Toaster />
          <audio ref={audioRef} />
        </>
      {/* )} */}
    </div>
  )
}

