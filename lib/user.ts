import { prisma } from './prisma'

export async function updateUser(userId: string, data: Partial<{
  name: string;
  email: string;
  bio: string;
  image: string;
  onboardingCompleted: boolean;
}>) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: data,
    })
    return updatedUser
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Failed to update user')
  }
}

