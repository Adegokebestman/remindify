import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 500 })
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a motivational coach. Provide a short, inspiring message for the day."
        },
        {
          role: "user",
          content: "Generate a motivational message for today."
        }
      ],
      max_tokens: 50
    })

    return NextResponse.json({ message: response.choices[0].message.content })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json({ error: 'Error generating motivational message' }, { status: 500 })
  }
}