import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Trophy, Star, Zap, CheckCircle } from 'lucide-react'

interface GamificationProps {
  completedReminders: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

export function Gamification({ completedReminders }: GamificationProps) {
  const [level, setLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [nextLevelExperience, setNextLevelExperience] = useState(100)
  const [streak, setStreak] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [completedRemindersToday, setCompletedRemindersToday] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    fetchUserProgress()
  }, [completedReminders])

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`/api/gamification?userId=${user?.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch user progress')
      }
      const data = await response.json()
      setLevel(data.level)
      setExperience(data.experience)
      setNextLevelExperience(data.nextLevelExperience)
      setStreak(data.streak)
      setAchievements(data.achievements)
      setCompletedRemindersToday(data.completedRemindersToday)
    } catch (error) {
      console.error('Error fetching user progress:', error)
    }
  }

  const progressPercentage = (experience / nextLevelExperience) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Your Progress
          <Badge variant="secondary">Level {level}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Experience</span>
              <span>{experience} / {nextLevelExperience} XP</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <span>Daily Streak</span>
            <div className="flex items-center">
              <Zap className="text-yellow-400 mr-1" />
              <span>{streak} days</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Completed Today</span>
            <div className="flex items-center">
              <CheckCircle className="text-green-400 mr-1" />
              <span>{completedRemindersToday} reminders</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Recent Achievements</h3>
            <div className="grid grid-cols-2 gap-2">
              {achievements.slice(0, 4).map((achievement) => (
                <motion.div
                  key={achievement.id}
                  className="flex items-center p-2 bg-secondary rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {achievement.icon}
                  <div className="ml-2">
                    <div className="text-sm font-medium">{achievement.title}</div>
                    <div className="text-xs text-muted-foreground">{achievement.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Complete more reminders to level up and unlock new features!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

