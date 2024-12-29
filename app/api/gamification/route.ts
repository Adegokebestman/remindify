import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        achievements: true,
        reminders: {
          where: {
            completedAt: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedRemindersToday = user.reminders.filter(reminder => {
      const reminderDate = new Date(reminder.completedAt);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() === today.getTime();
    });

    const nextLevelExperience = user.level * 100
    const streak = calculateStreak(user.reminders)
    const achievements = user.achievements.map(achievement => ({
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      icon: getAchievementIcon(achievement.type)
    }))

    return NextResponse.json({
      level: user.level,
      experience: user.experience,
      nextLevelExperience,
      streak,
      achievements,
      completedRemindersToday: completedRemindersToday.length
    })
  } catch (error) {
    console.error('Error fetching user progress:', error)
    return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { userId, completedReminders } = await request.json()

  if (!userId || typeof completedReminders !== 'number') {
    return NextResponse.json({ error: 'User ID and completed reminders count are required' }, { status: 400 })
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { achievements: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const experienceGained = completedReminders * 10
    let newExperience = user.experience + experienceGained
    let newLevel = user.level

    while (newExperience >= newLevel * 100) {
      newExperience -= newLevel * 100
      newLevel++
    }

    user = await prisma.user.update({
      where: { id: userId },
      data: { level: newLevel, experience: newExperience },
    })

    // Check for new achievements
    const newAchievements = await checkForNewAchievements(user, completedReminders)

    return NextResponse.json({
      level: user.level,
      experience: user.experience,
      nextLevelExperience: user.level * 100,
      newAchievements
    })
  } catch (error) {
    console.error('Error updating user progress:', error)
    return NextResponse.json({ error: 'Failed to update user progress' }, { status: 500 })
  }
}

function calculateStreak(reminders: any[]) {
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  while (true) {
    const remindersForDay = reminders.filter(reminder => {
      const reminderDate = new Date(reminder.completedAt);
      reminderDate.setHours(0, 0, 0, 0);
      return reminderDate.getTime() === currentDate.getTime();
    });

    if (remindersForDay.length > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function getAchievementIcon(type) {
  switch (type) {
    case 'STREAK':
      return 'Zap'
    case 'LEVEL':
      return 'Trophy'
    case 'TASK_COMPLETION':
      return 'CheckCircle'
    default:
      return 'Star'
  }
}

async function checkForNewAchievements(user, completedReminders) {
  const newAchievements = []

  // Check for streak achievement
  if (user.streak % 7 === 0) {
    newAchievements.push({
      title: `${user.streak} Day Streak!`,
      description: `You've completed tasks for ${user.streak} days in a row!`,
      type: 'STREAK'
    })
  }

  // Check for level achievement
  if (user.level % 5 === 0) {
    newAchievements.push({
      title: `Level ${user.level} Achieved!`,
      description: `You've reached level ${user.level}!`,
      type: 'LEVEL'
    })
  }

  // Check for task completion achievement
  if (completedReminders % 100 === 0) {
    newAchievements.push({
      title: `${completedReminders} Tasks Completed!`,
      description: `You've completed ${completedReminders} tasks!`,
      type: 'TASK_COMPLETION'
    })
  }

  // Save new achievements to the database
  if (newAchievements.length > 0) {
    await prisma.achievement.createMany({
      data: newAchievements.map(achievement => ({
        ...achievement,
        userId: user.id
      }))
    })
  }

  return newAchievements
}

