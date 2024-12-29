import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const remindersByCategory = await prisma.reminder.groupBy({
      by: ['category'],
      _count: {
        category: true
      },
      where: {
        userId: userId
      }
    })

    const formattedData = remindersByCategory.map(item => ({
      category: item.category,
      count: item._count.category
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching reminders by category:', error)
    return NextResponse.json({ error: 'Failed to fetch reminders by category' }, { status: 500 })
  }
}

