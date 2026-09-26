import { Outlet } from "react-router-dom"

import { SiteNavbar } from "@/components/site-navbar"
import Footer from "@/sections/Footer"

// Shared shell for browsing pages that need the navbar and footer, such as the
// house detail page. The home page renders its own shell.
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <div className="grow">
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}

export default AppLayout
