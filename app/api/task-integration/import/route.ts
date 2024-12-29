import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { userId, taskId, platform } = await request.json()

  if (!userId || !taskId || !platform) {
    return NextResponse.json({ error: 'User ID, task ID, and platform are required' }, { status: 400 })
  }

  try {
    // In a real application, you would fetch the task details from the platform's API here
    const taskDetails = { title: `Imported task ${taskId} from ${platform}`, date: new Date().toISOString().split('T')[0] }

    const reminder = await prisma.reminder.create({
      data: {
        userId,
        title: taskDetails.title,
        date: taskDetails.date,
        category: platform,
        tags: [platform],
        time: '09:00', // Default time
        recurring: 'none',
      },
    })

    return NextResponse.json(reminder)
  } catch (error) {
    console.error('Error importing task:', error)
    return NextResponse.json({ error: 'Failed to import task' }, { status: 500 })
  }
}

