import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const { prompt, type } = await request.json()

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 500 })
  }

  try {
    let systemPrompt = ''
    if (type === 'suggestion') {
      systemPrompt = "You are a helpful productivity assistant. Provide concise and actionable productivity tips based on the user's input."
    } else if (type === 'prioritization') {
      systemPrompt = "You are a task prioritization expert. Given a list of tasks, prioritize them based on importance and urgency."
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 150
    })

    if (type === 'suggestion') {
      return NextResponse.json({ response: response.choices[0].message.content })
    } else if (type === 'prioritization') {
      const prioritizedTasks = JSON.parse(response.choices[0].message.content || '[]')
      return NextResponse.json({ prioritizedTasks })
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 })
  }
}