/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import type { Session, User } from "@supabase/supabase-js"

import type { AppRole } from "@/lib/roles"
import { supabase } from "@/lib/supabase"
import {
  fetchProfile,
  getVerifiedSession,
  signOut,
  type Profile,
} from "@/services/auth"

type AuthProviderState = {
  session: Session | null
  user: User | null
  profile: Profile | null
  role: AppRole | null
  // True until the session and, when signed in, the profile have loaded.
  isLoading: boolean
  signOut: () => Promise<void>
}

type ProfileState = { userId: string; profile: Profile | null }

const AuthProviderContext = React.createContext<AuthProviderState | undefined>(
  undefined
)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null)
  const [isSessionLoading, setIsSessionLoading] = React.useState(true)
  const [profileState, setProfileState] = React.useState<ProfileState | null>(
    null
  )

  React.useEffect(() => {
    let cancelled = false

    getVerifiedSession()
      .then((initialSession) => {
        if (!cancelled) setSession(initialSession)
      })
      .catch((err: unknown) => {
        console.error("Failed to load session:", err)
      })
      .finally(() => {
        if (!cancelled) setIsSessionLoading(false)
      })

    // Keeps the session current after login, logout, token refresh and
    // email confirmation links. INITIAL_SESSION is skipped because that
    // session isn't verified yet; getVerifiedSession() above provides it.
    // Only sets state here: Supabase warns against awaiting other auth calls
    // inside this callback.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "INITIAL_SESSION") return
      setSession(nextSession)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const userId = session?.user.id ?? null

  React.useEffect(() => {
    if (!userId) return
    let cancelled = false

    fetchProfile(userId)
      .then((profile) => {
        if (!cancelled) setProfileState({ userId, profile })
      })
      .catch((err: unknown) => {
        console.error("Failed to load profile:", err)
        if (!cancelled) setProfileState({ userId, profile: null })
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  // Ignore a profile that belongs to a previous user.
  const profile =
    userId && profileState?.userId === userId ? profileState.profile : null
  const isProfileLoading = userId !== null && profileState?.userId !== userId

  const value: AuthProviderState = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    isLoading: isSessionLoading || isProfileLoading,
    signOut,
  }

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthProviderContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
