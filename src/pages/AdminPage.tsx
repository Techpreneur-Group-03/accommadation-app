import { useState } from "react"
import { LogOut } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"

// Placeholder until the admin dashboard is built.
export function AdminPage() {
  const { user, profile, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-muted/50 px-4 text-center">
      <h1 className="font-heading text-4xl font-bold text-brand-dark">Admin</h1>
      <p className="text-sm text-muted-foreground">
        Signed in as {profile?.fullName ?? user?.email} ({profile?.role})
      </p>
      <Button
        variant="outline"
        disabled={isSigningOut}
        onClick={handleSignOut}
        className="mt-3"
      >
        <LogOut />
        Log out
      </Button>
    </main>
  )
}

export default AdminPage
