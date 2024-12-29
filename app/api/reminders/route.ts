import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const ReminderSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string().min(1, "Title is required"),
  category: z.string(),
  tags: z.array(z.string()),
  date: z.string(),
  time: z.string(),
  recurring: z.string(),
  sound: z.string().optional(),
})

type Reminder = z.infer<typeof ReminderSchema>

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId },
    })
    return NextResponse.json(reminders)
  } catch (error) {
    console.error('Error fetching reminders:', error)
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const reminder = ReminderSchema.parse(body)
    const createdReminder = await prisma.reminder.create({
      data: reminder,
    })
    return NextResponse.json(createdReminder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return NextResponse.json({ error: `Validation error: ${errorMessages}` }, { status: 400 })
    }
    console.error('Error creating reminder:', error)
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const body = await request.json()

  try {
    const updatedReminder = ReminderSchema.parse(body)
    const reminder = await prisma.reminder.update({
      where: { id: updatedReminder.id },
      data: updatedReminder,
    })
    return NextResponse.json(reminder)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating reminder:', error)
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const userId = searchParams.get('userId')

  if (!id || !userId) {
    return NextResponse.json({ error: 'ID and User ID are required' }, { status: 400 })
  }

  try {
    await prisma.reminder.delete({
      where: { id, userId },
    })
    return NextResponse.json({ id })
  } catch (error) {
    console.error('Error deleting reminder:', error)
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 })
  }
}

