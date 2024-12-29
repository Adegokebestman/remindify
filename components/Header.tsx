import { DarkModeToggle } from './DarkModeToggle'

export function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold">VocoRemind</h1>
        <p className="text-muted-foreground">Your voice, your reminder. Personalized for every moment.</p>
      </div>
      <DarkModeToggle />
    </header>
  )
}

