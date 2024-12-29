import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash, Mic } from 'lucide-react'
import { Reminder } from '@/types/reminder'
import { Badge } from "@/components/ui/badge"

interface ReminderCardProps {
  reminder: Reminder
  onEdit: (reminder: Reminder) => void
  onDelete: (id: string) => void
  onSnooze: (reminder: Reminder) => void
}

export function ReminderCard({ reminder, onEdit, onDelete, onSnooze }: ReminderCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{reminder.title}</CardTitle>
        <CardDescription>{reminder.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{reminder.date} at {reminder.time}</p>
        <p>Recurring: {reminder.recurring}</p>
        {reminder.tags && reminder.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {reminder.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <div>
          <Button variant="outline" size="sm" onClick={() => onSnooze(reminder)}>Snooze</Button>
          {reminder.sound && (
            <Button variant="ghost" size="sm" onClick={() => {}}>
              <Mic className="mr-2 h-4 w-4" />
              Play Sound
            </Button>
          )}
        </div>
        <div>
          <Button variant="ghost" size="sm" onClick={() => onEdit(reminder)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(reminder.id)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

