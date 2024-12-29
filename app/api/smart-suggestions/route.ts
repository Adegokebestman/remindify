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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reminders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userReminders = user.reminders
    const userHabits = await prisma.habit.findMany({ where: { userId } })
    const userLevel = user.level || 1

    const reminderSummary = userReminders.map(r => `${r.title} (${r.category})`).join(', ')
    const habitSummary = userHabits.map(h => h.title).join(', ')

    const prompt = `
      Based on the user's recent reminders: ${reminderSummary},
      and habits: ${habitSummary},
      suggest 3 new reminders that might be helpful.
      Consider the user's productivity level (${userLevel}) and tailor suggestions accordingly.
      For each suggestion, provide a reason why it might be helpful.
      Format the response as a JSON array of objects with id, title, category, date, time, and reason properties.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful productivity assistant. Provide concise and relevant reminder suggestions based on the user's recent activities and habits." },
        { role: "user", content: prompt }
      ],
    })

    let suggestions = [];
    try {
      const content = completion.choices[0].message.content || '[]';
      // Remove any markdown formatting if present
      const jsonContent = content.replace(/\`\`\`json\n|\n\`\`\`/g, '').trim();
      suggestions = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      suggestions = []; // Fallback to empty array if parsing fails
    }

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error('Error generating smart suggestions:', error);
    console.error('AI response:', completion.choices[0].message.content);
    return NextResponse.json({ error: 'Failed to generate smart suggestions' }, { status: 500 })
  }
}

