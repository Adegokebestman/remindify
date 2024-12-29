import { Reminder } from '@/types/reminder'

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification")
    return false
  }

  let permission = await Notification.requestPermission()

  return permission === "granted"
}

export function scheduleNotification(reminder: Reminder) {
  const notificationTime = new Date(`${reminder.date}T${reminder.time}`)
  const now = new Date()
  const timeUntilNotification = notificationTime.getTime() - now.getTime()

  if (timeUntilNotification > 0) {
    setTimeout(() => {
      showNotification(reminder)
    }, timeUntilNotification)
  }
}

export function showNotification(reminder: Reminder) {
  if (Notification.permission === "granted") {
    new Notification(reminder.title, {
      body: `It's time for your ${reminder.category} reminder!`,
      icon: '/icon.png' // Make sure to add an icon file to your public folder
    })
  }
}

