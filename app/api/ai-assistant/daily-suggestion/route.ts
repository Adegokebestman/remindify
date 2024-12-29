import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    // Fetch user's reminders
    const reminders = await prisma.reminder.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    })

    // Generate a prompt based on the user's reminders
    const reminderSummary = reminders.map(r => `${r.title} (${r.date})`).join(', ')
    const prompt = `Based on the user's recent reminders: ${reminderSummary}, provide a short, motivational productivity suggestion.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful productivity assistant. Provide a short, motivational suggestion based on the user's recent reminders." },
        { role: "user", content: prompt }
      ],
    })

    const suggestion = completion.choices[0].message.content

    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error('Error generating daily suggestion:', error)
    return NextResponse.json({ error: 'Failed to generate daily suggestion' }, { status: 500 })
  }
}

