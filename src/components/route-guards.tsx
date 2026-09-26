import type { ReactNode } from "react"
import { LoaderCircle } from "lucide-react"
import { Navigate } from "react-router"

import { useAuth } from "@/components/auth-provider"
import { homePathForRole, type AppRole } from "@/lib/roles"

export function FullPageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-svh items-center justify-center bg-muted/50"
    >
      <LoaderCircle className="size-8 animate-spin text-brand" />
    </div>
  )
}

// For login and register: a signed-in user is sent to their role's page.
// This is also what redirects after a successful login or email confirmation.
export function GuestOnly({ children }: { children: ReactNode }) {
  const { session, role, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (session) return <Navigate to={homePathForRole(role)} replace />

  return children
}

interface RequireRoleProps {
  roles: AppRole[]
  children: ReactNode
}

// UI routing only. What a user can read or change is enforced by the
// Row Level Security policies in Supabase.
export function RequireRole({ roles, children }: RequireRoleProps) {
  const { session, role, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (!session) return <Navigate to="/login" replace />
  if (!role || !roles.includes(role)) {
    return <Navigate to={homePathForRole(role)} replace />
  }

  return children
}
