import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const { message, userId } = await request.json()

  if (!message || !userId) {
    return NextResponse.json({ error: 'Message and user ID are required' }, { status: 400 })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful productivity assistant. Provide concise and actionable advice." },
        { role: "user", content: message }
      ],
    })

    const reply = completion.choices[0].message.content

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 })
  }
}

