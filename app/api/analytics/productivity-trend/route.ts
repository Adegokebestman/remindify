import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const today = new Date()
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const productivityTrend = await prisma.reminder.groupBy({
      by: ['date'],
      _count: {
        id: true
      },
      where: {
        userId: userId,
        date: {
          gte: sevenDaysAgo.toISOString().split('T')[0],
          lte: today.toISOString().split('T')[0]
        }
      },
      orderBy: {
        date: 'asc'
      }
    })

    const formattedData = productivityTrend.map(item => ({
      date: item.date,
      completedTasks: item._count.id
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Error fetching productivity trend:', error)
    return NextResponse.json({ error: 'Failed to fetch productivity trend' }, { status: 500 })
  }
}

