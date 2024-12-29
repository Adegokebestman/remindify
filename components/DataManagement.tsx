"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-hot-toast'
import { Reminder } from '@/types/reminder'
import { useAuth } from '@/contexts/AuthContext'

export function DataManagement() {
  const [importFile, setImportFile] = useState<File | null>(null)
  const { user } = useAuth()

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/reminders?userId=${user?.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reminders')
      }
      const reminders = await response.json()
      const dataStr = JSON.stringify(reminders)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
      const exportFileDefaultName = 'vocoremind_export.json'

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      toast.error('Please select a file to import')
      return
    }

    try {
      const fileContent = await importFile.text()
      const importedData = JSON.parse(fileContent) as Reminder[]

      const response = await fetch('/api/reminders/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminders: importedData, userId: user?.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to import reminders')
      }

      toast.success('Data imported successfully!')
    } catch (error) {
      console.error('Error importing data:', error)
      toast.error('Failed to import data')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>Export or import your VocoRemind data</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button onClick={handleExport}>Export Data</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="file"
            accept=".json"
            onChange={(e) => setImportFile(e.target.files?.[0] || null)}
          />
          <Button onClick={handleImport}>Import Data</Button>
        </div>
      </CardContent>
    </Card>
  )
}

