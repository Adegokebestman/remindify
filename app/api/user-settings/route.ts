import { NextResponse } from 'next/server'
import { z } from 'zod'

// Mock database
const userSettings: Record<string, UserSettings> = {}

const UserSettingsSchema = z.object({
  userId: z.string(),
  theme: z.enum(['light', 'dark']),
  timezone: z.string(),
  notificationPreference: z.enum(['email', 'push', 'both']),
})

type UserSettings = z.infer<typeof UserSettingsSchema>

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  const settings = userSettings[userId] || {
    userId,
    theme: 'light',
    timezone: 'UTC',
    notificationPreference: 'both'
  }

  return NextResponse.json(settings)
}

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const settings = UserSettingsSchema.parse(body)
    userSettings[settings.userId] = settings
    return NextResponse.json(settings)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

