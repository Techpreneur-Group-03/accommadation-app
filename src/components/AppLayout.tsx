import { Outlet } from "react-router-dom"

import { Navbar } from "@/components/navbar"
import Footer from "@/sections/Footer"

export function AppLayout() {
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

      <div className="grow">
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}

export default AppLayout
