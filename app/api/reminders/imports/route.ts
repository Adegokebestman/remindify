import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Reminder } from '@/types/reminder'

export async function POST(request: Request) {
  const body = await request.json()
  const { reminders, userId } = body

  if (!userId || !Array.isArray(reminders)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // Delete existing reminders for the user
      await prisma.reminder.deleteMany({ where: { userId } })

      // Insert imported reminders
      for (const reminder of reminders) {
        const { id, ...reminderData } = reminder as Reminder
        await prisma.reminder.create({
          data: {
            ...reminderData,
            userId,
          },
        })
      }
    })

    return NextResponse.json({ message: 'Data imported successfully' })
  } catch (error) {
    console.error('Error importing reminders:', error)
    return NextResponse.json({ error: 'Failed to import reminders' }, { status: 500 })
  }
}

