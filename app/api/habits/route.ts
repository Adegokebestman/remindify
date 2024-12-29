import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const habits = await prisma.habit.findMany({
      where: { userId },
    })
    return NextResponse.json(habits)
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json({ error: 'Failed to fetch habits' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId, title, frequency } = await request.json()

  if (!userId || !title || !frequency) {
    return NextResponse.json({ error: 'User ID, title, and frequency are required' }, { status: 400 })
  }

  try {
    const habit = await prisma.habit.create({
      data: {
        userId,
        title,
        frequency,
        completedDates: [],
      },
    })
    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json({ error: 'Failed to create habit' }, { status: 500 })
  }
}

