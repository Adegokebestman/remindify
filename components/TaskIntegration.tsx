import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/contexts/AuthContext'

interface Task {
  id: string
  title: string
  platform: string
}

export function TaskIntegration() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (selectedPlatform) {
      fetchTasks()
    }
  }, [selectedPlatform])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/task-integration?userId=${user?.id}&platform=${selectedPlatform}`)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const importTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/task-integration/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, taskId, platform: selectedPlatform }),
      })
      if (!response.ok) {
        throw new Error('Failed to import task')
      }
      // Remove the imported task from the list
      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error importing task:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Integration</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setSelectedPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trello">Trello</SelectItem>
            <SelectItem value="asana">Asana</SelectItem>
            <SelectItem value="jira">Jira</SelectItem>
          </SelectContent>
        </Select>
        {selectedPlatform && (
          <div className="mt-4 space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between">
                <span>{task.title}</span>
                <Button onClick={() => importTask(task.id)}>Import</Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

