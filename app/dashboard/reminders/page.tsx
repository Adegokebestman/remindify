"use client"

import { useState, useEffect } from 'react'
import { ReminderList } from '@/components/ReminderList'
import { Reminder } from '@/types/reminder'
import { useAuth } from '@/contexts/AuthContext'
import { toast, Toaster } from 'react-hot-toast'

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetchReminders()
    }
  }, [user])

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

  const createReminder = async (reminder: Reminder) => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reminder, userId: user?.id }),
      })
      if (!response.ok) {
        throw new Error('Failed to create reminder')
      }
      const data = await response.json()
      setReminders([...reminders, data])
      toast.success('Reminder created successfully!')
    } catch (error) {
      console.error('Error creating reminder:', error)
      toast.error('Failed to create reminder')
    }
  }

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
  };

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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Reminders</h1>
      <ReminderList
        reminders={reminders}
        onAddReminder={createReminder}
        onUpdateReminder={updateReminder}
        onDeleteReminder={deleteReminder}
        onSnoozeReminder={handleSnooze}
      />
      <Toaster />
    </div>
  )
}

