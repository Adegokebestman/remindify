"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import VoiceRecorder from './VoiceRecorder'
import { Reminder } from '@/types/reminder'

interface AddEditReminderDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  reminder: Reminder | null
  onSave: (reminder: Reminder) => void
}

export function AddEditReminderDialog({ isOpen, onOpenChange, reminder, onSave }: AddEditReminderDialogProps) {
  const [formData, setFormData] = useState<Partial<Reminder>>({})
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null)
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (reminder) {
      setFormData(reminder)
      setTags(reminder.tags || [])
    } else {
      setFormData({})
      setTags([])
    }
    setRecordedAudioBlob(null)
  }, [reminder, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      e.currentTarget.value = ''
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSoundUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setRecordedAudioBlob(file)
    }
  }

  const handleVoiceRecording = (audioBlob: Blob) => {
    setRecordedAudioBlob(audioBlob)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let reminderToSave = { ...formData, tags } as Reminder

    if (recordedAudioBlob) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Sound = reader.result as string
        reminderToSave.sound = base64Sound
        onSave(reminderToSave)
        onOpenChange(false)
      }
      reader.readAsDataURL(recordedAudioBlob)
    } else {
      onSave(reminderToSave)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{reminder ? 'Edit Reminder' : 'Add New Reminder'}</DialogTitle>
          <DialogDescription>
            {reminder ? 'Edit your reminder details below.' : 'Fill in the details for your new reminder.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" value={formData.category || ''} onValueChange={(value) => handleInputChange({ target: { name: 'category', value } } as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-xs">&times;</button>
                </span>
              ))}
            </div>
            <Input
              id="tags"
              placeholder="Add tags (press Enter to add)"
              onKeyDown={handleTagInput}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date || ''} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" value={formData.time || ''} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recurring">Recurring</Label>
            <Select name="recurring" value={formData.recurring || ''} onValueChange={(value) => handleInputChange({ target: { name: 'recurring', value } } as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sound">Custom Sound</Label>
            <Input id="sound" name="sound" type="file" accept="audio/*" onChange={handleSoundUpload} />
          </div>
          <div className="space-y-2">
            <Label>Voice Recording</Label>
            <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
          </div>
          <DialogFooter>
            <Button type="submit">{reminder ? 'Update' : 'Add'} Reminder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

