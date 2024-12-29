import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Reminder } from "@/types/reminder"

interface ReminderCalendarProps {
  reminders: Reminder[]
}

export function ReminderCalendar({ reminders }: ReminderCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const reminderDates = reminders.reduce((acc, reminder) => {
    const date = reminder.date
    if (acc[date]) {
      acc[date].push(reminder)
    } else {
      acc[date] = [reminder]
    }
    return acc
  }, {} as Record<string, Reminder[]>)

  const selectedDateReminders = selectedDate
    ? reminderDates[selectedDate.toISOString().split('T')[0]] || []
    : []

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Reminder Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            components={{
              day: ({ date, ...props }) => {
                const formattedDate = date.toISOString().split('T')[0]
                const hasReminders = reminderDates[formattedDate]?.length > 0
                return (
                  <div {...props}>
                    {date.getDate()}
                    {hasReminders && (
                      <div className="w-1 h-1 bg-primary rounded-full mx-auto mt-1" />
                    )}
                  </div>
                )
              },
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Reminders for {selectedDate?.toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateReminders.length > 0 ? (
            <ul className="space-y-2">
              {selectedDateReminders.map((reminder) => (
                <li key={reminder.id} className="flex items-center justify-between">
                  <span>{reminder.title}</span>
                  <Badge>{reminder.time}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reminders for this date.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

