import type { ReactNode } from "react"

import { Navbar } from "@/components/navbar"
import Footer from "@/sections/Footer"

interface AppLayoutProps {
  children: ReactNode
}

// Shared shell for browsing pages that need the navbar and footer, such as the
// house detail page. The home page renders its own shell.
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        activeTab="home"
        notificationCount={3}
        messageCount={2}
        onNotificationClick={() => alert("notifications!")}
        onMessageClick={() => alert("messages!")}
        onProfileClick={() => alert("profile!")}
      />

      <div className="grow">{children}</div>

      <Footer />
    </div>
  )
}

export default AppLayout
