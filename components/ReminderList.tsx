"use client"

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { ReminderCard } from './ReminderCard'
import { AddEditReminderDialog } from './AddEditReminderDialog'
import { Reminder } from '@/types/reminder'

interface ReminderListProps {
  reminders: Reminder[]
  onAddReminder: (reminder: Reminder) => void
  onUpdateReminder: (reminder: Reminder) => void
  onDeleteReminder: (id: string) => void
  onSnoozeReminder: (reminder: Reminder) => void
}

export function ReminderList({ reminders, onAddReminder, onUpdateReminder, onDeleteReminder, onSnoozeReminder }: ReminderListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setIsDialogOpen(true)
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Reminders</h2>
        <Button onClick={() => { setEditingReminder(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Reminder
        </Button>
      </div>
      <AnimatePresence>
        {reminders.map((reminder) => (
          <motion.div
            key={reminder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ReminderCard
              reminder={reminder}
              onEdit={handleEdit}
              onDelete={onDeleteReminder}
              onSnooze={onSnoozeReminder}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      <AddEditReminderDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reminder={editingReminder}
        onSave={editingReminder ? onUpdateReminder : onAddReminder}
      />
    </section>
  )
}

