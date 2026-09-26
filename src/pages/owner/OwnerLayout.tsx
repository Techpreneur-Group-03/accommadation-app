import {
  Bell,
  Building2,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  SquarePlus,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"

import { useAuth } from "@/components/auth-provider"
import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getInitials } from "@/lib/utils"

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  isActive: (pathname: string) => boolean
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: (pathname) => pathname === "/admin",
  },
  {
    to: "/admin/listings",
    label: "My Listings",
    icon: Building2,
    isActive: (pathname) =>
      pathname.startsWith("/admin/listings") &&
      pathname !== "/admin/listings/new",
  },
  {
    to: "/admin/listings/new",
    label: "Add Listing",
    icon: SquarePlus,
    isActive: (pathname) => pathname === "/admin/listings/new",
  },
]

function pageTitle(pathname: string) {
  if (pathname === "/admin/listings/new") return "Add Listing"
  if (pathname.endsWith("/edit")) return "Edit Listing"
  if (pathname.startsWith("/admin/listings")) return "My Listings"
  return "Dashboard"
}

const menuButtonClassName =
  "h-11 gap-3 rounded-lg px-4 text-[15px] text-foreground/80 data-active:bg-brand data-active:font-normal data-active:text-brand-foreground data-active:hover:bg-brand/90 data-active:hover:text-brand-foreground [&_svg]:size-5"

// Shell for the house owner portal (routes under /admin).
export function OwnerLayout() {
  const { pathname } = useLocation()
  const { user, profile, signOut } = useAuth()
  const displayName = profile?.fullName ?? user?.email ?? ""

  return (
    <SidebarProvider>
      <Sidebar className="border-r-0 bg-card">
        <SidebarHeader className="px-6 pt-8 pb-6">
          <Link to="/admin" aria-label="Go to dashboard">
            <Logo className="text-2xl" />
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-3">
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-normal">
              Owner Portal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5">
                {NAV_ITEMS.map(({ to, label, icon: Icon, isActive }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      render={<Link to={to} />}
                      isActive={isActive(pathname)}
                      className={menuButtonClassName}
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-3 my-2" />

          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-normal">
              Conversation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    aria-disabled
                    className={menuButtonClassName}
                  >
                    <MessagesSquare />
                    <span>Chat</span>
                    <Badge variant="secondary" className="ml-auto">
                      Soon
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-3 pb-8">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className={menuButtonClassName}
                onClick={() => {
                  signOut().catch((err: unknown) =>
                    console.error("Failed to log out:", err)
                  )
                }}
              >
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="min-w-0 bg-muted/50">
        <header className="sticky top-0 z-10 flex h-20 items-center gap-3 bg-card px-4 sm:px-8">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-heading text-xl font-semibold tracking-wide text-brand-dark sm:text-2xl">
            {pageTitle(pathname)}
          </h1>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            {/* Alerts and notifications aren't built yet. */}
            <span
              title="Alerts (coming soon)"
              className="hidden p-2 text-orange-400 sm:block"
            >
              <TriangleAlert className="size-5" />
            </span>
            <span
              title="Notifications (coming soon)"
              className="hidden p-2 text-brand sm:block"
            >
              <Bell className="size-5" />
            </span>
            <Avatar className="size-10" title={displayName}>
              <AvatarFallback className="bg-brand/15 font-semibold text-brand">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default OwnerLayout
