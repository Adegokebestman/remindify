"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Layout } from '@/components/Layout'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    name: 'Free',
    price: '$0/month',
    features: ['5 reminders', 'Basic notifications', 'Web access'],
    stripePriceId: '',
  },
  {
    name: 'Pro',
    price: '$9.99/month',
    features: ['Unlimited reminders', 'AI assistant', 'Advanced analytics', 'Priority support'],
    stripePriceId: 'price_1234567890',
  },
  {
    name: 'Business',
    price: '$19.99/month',
    features: ['Everything in Pro', 'Team collaboration', 'Custom integrations', 'Dedicated account manager'],
    stripePriceId: 'price_0987654321',
  },
]

export default function PricingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState('')

  const handleSubscription = async (priceId: string) => {
    setLoading(priceId)
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: user?.id,
      }),
    })

    const { sessionId } = await response.json()
    const stripe = await stripePromise
    await stripe?.redirectToCheckout({ sessionId })
    setLoading('')
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.price}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="list-disc list-inside space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleSubscription(plan.stripePriceId)}
                  disabled={!user || loading === plan.stripePriceId || plan.name === 'Free'}
                >
                  {loading === plan.stripePriceId ? 'Loading...' : `Subscribe to ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}

