import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { suggestionId, isPositive, userId } = await request.json()

  if (!suggestionId || typeof isPositive !== 'boolean' || !userId) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  try {
    await prisma.suggestionFeedback.create({
      data: {
        suggestionId,
        isPositive,
        userId,
      },
    })

    return NextResponse.json({ message: 'Feedback recorded successfully' })
  } catch (error) {
    console.error('Error recording suggestion feedback:', error)
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 })
  }
}

