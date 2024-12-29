"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAuth } from '@/contexts/AuthContext'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface ReminderData {
  category: string
  count: number
}

interface ProductivityData {
  date: string
  completedTasks: number
}

interface WeekdayData {
  day: string
  count: number
}

export function DataVisualization() {
  const [remindersByCategory, setRemindersByCategory] = useState<ReminderData[]>([])
  const [productivityTrend, setProductivityTrend] = useState<ProductivityData[]>([])
  const [remindersByWeekday, setRemindersByWeekday] = useState<WeekdayData[]>([])
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user?.id) {
      setError('User ID is not available. Please try logging in again.')
      return
    }

    try {
      const [categoryData, productivityData, weekdayData] = await Promise.all([
        fetch(`/api/analytics/reminders-by-category?userId=${user.id}`).then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        }),
        fetch(`/api/analytics/productivity-trend?userId=${user.id}`).then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        }),
        fetch(`/api/analytics/reminders-by-weekday?userId=${user.id}`).then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
      ])

      setRemindersByCategory(categoryData)
      setProductivityTrend(productivityData)
      setRemindersByWeekday(weekdayData)
      setError(null)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError('Failed to load analytics data. Please try again later.')
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
        <CardDescription>Visualize your reminder patterns and productivity</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="categories">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="weekdays">Weekdays</TabsTrigger>
          </TabsList>
          <TabsContent value="categories">
            <ChartContainer
              config={{
                category: {
                  label: "Category",
                  color: "hsl(var(--chart-1))",
                },
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={remindersByCategory}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {remindersByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="productivity">
            <ChartContainer
              config={{
                date: {
                  label: "Date",
                  color: "hsl(var(--chart-1))",
                },
                completedTasks: {
                  label: "Completed Tasks",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line type="monotone" dataKey="completedTasks" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="weekdays">
            <ChartContainer
              config={{
                day: {
                  label: "Day",
                  color: "hsl(var(--chart-1))",
                },
                count: {
                  label: "Count",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={remindersByWeekday}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

