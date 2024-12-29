import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { userId } = await request.json()
  const habitId = params.id

  if (!userId || !habitId) {
    return NextResponse.json({ error: 'User ID and habit ID are required' }, { status: 400 })
  }

  try {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    })

    if (!habit || habit.userId !== userId) {
      return NextResponse.json({ error: 'Habit not found or unauthorized' }, { status: 404 })
    }

    const today = new Date().toISOString().split('T')[0]
    const updatedCompletedDates = habit.completedDates.includes(today)
      ? habit.completedDates.filter(date => date !== today)
      : [...habit.completedDates, today]

    const updatedHabit = await prisma.habit.update({
      where: { id: habitId },
      data: { completedDates: updatedCompletedDates },
    })

    return NextResponse.json(updatedHabit)
  } catch (error) {
    console.error('Error toggling habit:', error)
    return NextResponse.json({ error: 'Failed to toggle habit' }, { status: 500 })
  }
}

