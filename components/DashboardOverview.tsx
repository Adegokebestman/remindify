import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Reminder } from "@/types/reminder"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface DashboardOverviewProps {
  reminders: Reminder[]
}

export function DashboardOverview({ reminders }: DashboardOverviewProps) {
  const totalReminders = reminders.length
  const completedReminders = reminders.filter(r => new Date(`${r.date}T${r.time}`) < new Date()).length
  const upcomingReminders = totalReminders - completedReminders

  const categoryData = reminders.reduce((acc, reminder) => {
    acc[reminder.category] = (acc[reminder.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReminders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedReminders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingReminders}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reminders by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              name: {
                label: "Category",
                color: "hsl(var(--chart-1))",
              },
              value: {
                label: "Count",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

