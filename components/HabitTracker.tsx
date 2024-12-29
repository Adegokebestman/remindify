import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from '@/contexts/AuthContext'

interface Habit {
  id: string
  title: string
  frequency: number
  completedDates: string[]
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitTitle, setNewHabitTitle] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch(`/api/habits?userId=${user?.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch habits')
      }
      const data = await response.json()
      setHabits(data)
    } catch (error) {
      console.error('Error fetching habits:', error)
    }
  }

  const addHabit = async () => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, title: newHabitTitle, frequency: 7 }),
      })
      if (!response.ok) {
        throw new Error('Failed to add habit')
      }
      const newHabit = await response.json()
      setHabits([...habits, newHabit])
      setNewHabitTitle('')
    } catch (error) {
      console.error('Error adding habit:', error)
    }
  }

  const toggleHabit = async (habitId: string) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })
      if (!response.ok) {
        throw new Error('Failed to toggle habit')
      }
      const updatedHabit = await response.json()
      setHabits(habits.map(h => h.id === updatedHabit.id ? updatedHabit : h))
    } catch (error) {
      console.error('Error toggling habit:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="flex items-center justify-between">
              <span>{habit.title}</span>
              <Button onClick={() => toggleHabit(habit.id)}>
                {habit.completedDates.includes(new Date().toISOString().split('T')[0]) ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="New habit title"
            />
            <Button onClick={addHabit}>Add Habit</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

