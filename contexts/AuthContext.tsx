"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  name: string
  email: string
  bio?: string
  image?: string
  onboardingCompleted?: boolean
}

interface AuthContextType {
  user: UserProfile | null
  login: () => Promise<void>
  logout: () => Promise<void>
  updateUser: (profile: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user) {
      setUser(session.user as UserProfile)
    }
  }, [status, router, session])

  const login = async () => {
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  const logout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const updateUser = async (profile: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error('Failed to update user profile')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

