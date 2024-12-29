export type Reminder = {
  id: string
  userId: string
  title: string
  category: string
  tags: string[]
  date: string
  time: string
  recurring: string
  sound: string
}

export type Category = {
  id: string
  userId: string
  name: string
}

