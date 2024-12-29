import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Reminder } from "@/types/reminder"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductivityTrackerProps {
  reminders: Reminder[]
}

export function ProductivityTracker({ reminders }: ProductivityTrackerProps) {
  const [timeRange, setTimeRange] = useState('week')
  const [productivityData, setProductivityData] = useState<{ date: string; completed: number; created: number; pomodoroSessions: number }[]>([])

  useEffect(() => {
    const data = generateProductivityData(reminders, timeRange)
    setProductivityData(data)
  }, [reminders, timeRange])

  const generateProductivityData = (reminders: Reminder[], range: string) => {
    const now = new Date()
    const startDate = new Date(now)
    const data: { [key: string]: { completed: number; created: number; pomodoroSessions: number } } = {}

    switch (range) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    reminders.forEach(reminder => {
      const reminderDate = new Date(reminder.date)
      if (reminderDate >= startDate && reminderDate <= now) {
        const dateKey = reminderDate.toISOString().split('T')[0]
        if (!data[dateKey]) {
          data[dateKey] = { completed: 0, created: 1, pomodoroSessions: 0 }
        } else {
          data[dateKey].created++
        }

        if (reminderDate < now) {
          data[dateKey].completed++
        }
      }
    })

    // Simulate Pomodoro sessions (replace this with actual data when available)
    Object.keys(data).forEach(date => {
      data[date].pomodoroSessions = Math.floor(Math.random() * 5) + 1 // Random number between 1 and 5
    })

    return Object.entries(data)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Productivity Tracker</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            date: {
              label: "Date",
              color: "hsl(var(--chart-1))",
            },
            completed: {
              label: "Completed",
              color: "hsl(var(--chart-2))",
            },
            created: {
              label: "Created",
              color: "hsl(var(--chart-3))",
            },
            pomodoroSessions: {
              label: "Pomodoro Sessions",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="hsl(var(--chart-2))" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="created" stroke="hsl(var(--chart-3))" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="pomodoroSessions" stroke="hsl(var(--chart-4))" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

