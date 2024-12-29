import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'react-hot-toast'
import { Reminder } from "@/types/reminder"
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ThumbsUp, ThumbsDown } from 'lucide-react'

interface SmartSuggestionsProps {
  reminders: Reminder[]
  onAddReminder: (reminder: Partial<Reminder>) => void
}

interface Suggestion extends Partial<Reminder> {
  id: string
  reason: string
}

export function SmartSuggestions({ reminders, onAddReminder }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      generateSuggestions()
    }
  }, [reminders, user])

  const generateSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/smart-suggestions?userId=${user?.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch smart suggestions')
      }
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Error fetching smart suggestions:', error)
      toast.error('Failed to load suggestions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddReminder = async (suggestion: Suggestion) => {
    try {
      const reminderData = {
        title: suggestion.title,
        category: suggestion.category || 'General',
        tags: [],
        date: suggestion.date || new Date().toISOString().split('T')[0],
        time: suggestion.time || '09:00',
        recurring: 'none',
        sound: ''
      };
      await onAddReminder(reminderData);
      setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
      toast.success('Reminder added successfully!');
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Failed to add reminder. Please try again.');
    }
  };

  const handleFeedback = async (suggestionId: string, isPositive: boolean) => {
    try {
      await fetch('/api/smart-suggestions/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestionId, isPositive, userId: user?.id }),
      })
      toast.success('Thank you for your feedback!')
      setSuggestions(suggestions.filter(s => s.id !== suggestionId))
    } catch (error) {
      console.error('Error sending feedback:', error)
      toast.error('Failed to send feedback. Please try again.')
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Smart Suggestions</CardTitle>
        <Button variant="outline" size="sm" onClick={generateSuggestions}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-4 border rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{suggestion.reason}</p>
                  </div>
                  <Badge>{suggestion.category}</Badge>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleFeedback(suggestion.id, true)}>
                      <ThumbsUp className="h-4 w-4 mr-1" /> Helpful
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleFeedback(suggestion.id, false)}>
                      <ThumbsDown className="h-4 w-4 mr-1" /> Not Helpful
                    </Button>
                  </div>
                  <Button size="sm" onClick={() => handleAddReminder(suggestion)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        {!loading && suggestions.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400">No suggestions available. Try refreshing!</p>
        )}
      </CardContent>
    </Card>
  )
}

