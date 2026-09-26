import { useNavigate } from "react-router-dom"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { getInitials } from "@/lib/utils"

interface SiteNavbarProps {
  activeTab?: string
  onTabChange?: (id: string) => void
}

// The customer-side Navbar wired to the signed-in user.
export function SiteNavbar({
  activeTab = "home",
  onTabChange,
}: SiteNavbarProps) {
  const navigate = useNavigate()
  const { session, user, profile, signOut } = useAuth()
  const userName = profile?.fullName ?? user?.email ?? ""

  return (
    <Navbar
      activeTab={activeTab}
      onTabChange={onTabChange ?? (() => navigate("/"))}
      notificationCount={3}
      messageCount={2}
      isAuthenticated={session !== null}
      userName={profile?.fullName ?? undefined}
      userEmail={user?.email}
      userInitials={getInitials(userName)}
      onLogout={() => {
        // Navigate after sign-out finishes, otherwise /login still sees the
        // session and sends the user back.
        signOut()
          .then(() => navigate("/login", { replace: true }))
          .catch((err: unknown) => console.error("Failed to log out:", err))
      }}
    />
  )
}

export default SiteNavbar
