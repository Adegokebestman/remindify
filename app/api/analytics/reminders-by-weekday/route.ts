import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    const remindersByWeekday = await prisma.reminder.groupBy({
      by: ['date'],
      _count: {
        id: true
      },
      where: {
        userId: userId
      }
    })

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const weekdayCounts = weekdays.map(day => ({ day, count: 0 }))

    remindersByWeekday.forEach(item => {
      const date = new Date(item.date)
      const weekday = weekdays[date.getDay()]
      const weekdayData = weekdayCounts.find(d => d.day === weekday)
      if (weekdayData) {
        weekdayData.count += item._count.id
      }
    })

    return NextResponse.json(weekdayCounts)
  } catch (error) {
    console.error('Error fetching reminders by weekday:', error)
    return NextResponse.json({ error: 'Failed to fetch reminders by weekday' }, { status: 500 })
  }
}

