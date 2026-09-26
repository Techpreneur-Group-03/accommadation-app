import { Outlet } from "react-router-dom"

import { useAuth } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import Footer from "@/sections/Footer"

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

export function AppLayout() {
  const { session, user, profile, signOut } = useAuth()
  const userName = profile?.fullName ?? user?.email ?? ""

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        activeTab="home"
        notificationCount={3}
        messageCount={2}
        onNotificationClick={() => alert("notifications!")}
        onMessageClick={() => alert("messages!")}
        isAuthenticated={session !== null}
        userName={profile?.fullName ?? undefined}
        userEmail={user?.email}
        userInitials={getInitials(userName)}
        onLogout={() => {
          signOut().catch((err: unknown) =>
            console.error("Failed to log out:", err)
          )
        }}
      />

      <div className="grow">
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}

export default AppLayout
