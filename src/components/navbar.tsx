import {
  Bell,
  Heart,
  Home,
  LogOut,
  Megaphone,
  MessageSquareMore,
  Users,
} from "lucide-react"
import { Link } from "react-router-dom"

<<<<<<< HEAD
import { Home, Heart, Megaphone, Users, Bell, MessageSquareMore } from "lucide-react"
import { UserProfileMenu } from "@/components/user-profile-menu"

=======
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Logo } from "@/components/logo"
>>>>>>> origin/main
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, to: "/" },
  { id: "favorite", label: "Favorite", icon: Heart },
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "about-us", label: "About Us", icon: Users },
]

interface NavbarProps {
<<<<<<< HEAD
    activeTab?: string
    onTabChange?: (id: string) => void
    onNotificationClick?: () => void
    onMessageClick?: () => void
    /** Retained for API compatibility. The profile button now opens the auth
     *  dropdown instead of calling this. */
    onProfileClick?: () => void
    notificationCount?: number
    messageCount?: number
    userAvatarSrc?: string
    userInitials?: string
}

export function Navbar({
    activeTab = "home",
    onTabChange,
    onNotificationClick,
    onMessageClick,
    notificationCount = 0,
    messageCount = 0,
    userAvatarSrc = "/avatar.jpg",
    userInitials = "LN",
=======
  activeTab?: string
  onTabChange?: (id: string) => void
  onNotificationClick?: () => void
  onMessageClick?: () => void
  onLogout?: () => void
  isAuthenticated?: boolean
  userName?: string
  userEmail?: string
  notificationCount?: number
  messageCount?: number
  userAvatarSrc?: string
  userInitials?: string
}

export function Navbar({
  activeTab = "home",
  onTabChange,
  onNotificationClick,
  onMessageClick,
  onLogout,
  isAuthenticated = false,
  userName,
  userEmail,
  notificationCount = 0,
  messageCount = 0,
  userAvatarSrc = "/avatar.jpg",
  userInitials = "LN",
>>>>>>> origin/main
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map(({ id, label, icon: Icon, to }) => {
            const isActive = activeTab === id
            const className = cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-emerald-600 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-emerald-600"
            )

            if (to) {
              return (
                <Link key={id} to={to} className={className}>
                  <Icon className="size-4" />
                  {label}
                </Link>
              )
            }

            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange?.(id)}
                className={className}
              >
                <Icon className="size-4" />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNotificationClick}
            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-emerald-600"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
            )}
          </button>

<<<<<<< HEAD
                    {/* Profile / auth actions */}
                    <UserProfileMenu
                        avatarSrc={userAvatarSrc}
                        initials={userInitials}
                    />
=======
          <button
            type="button"
            onClick={onMessageClick}
            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-emerald-600"
            aria-label="Messages"
          >
            <MessageSquareMore className="size-5" />
            {messageCount > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {isAuthenticated ? (
            <Popover>
              <PopoverTrigger
                className="rounded-full transition-opacity hover:opacity-80"
                aria-label="Account menu"
              >
                <Avatar className="size-9">
                  <AvatarImage src={userAvatarSrc} alt="User avatar" />
                  <AvatarFallback className="bg-emerald-100 text-sm font-semibold text-emerald-700">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-60 gap-3">
                <div className="min-w-0">
                  {userName && <p className="truncate font-medium">{userName}</p>}
                  {userEmail && (
                    <p className="truncate text-xs text-muted-foreground">
                      {userEmail}
                    </p>
                  )}
>>>>>>> origin/main
                </div>
                <Button variant="outline" onClick={onLogout}>
                  <LogOut />
                  Log out
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              render={<Link to="/login" />}
              nativeButton={false}
              className="h-9 rounded-lg bg-brand px-4 text-brand-foreground hover:bg-brand/90"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
        {NAV_ITEMS.map(({ id, label, icon: Icon, to }) => {
          const isActive = activeTab === id
          const className = cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
            isActive
              ? "bg-emerald-600 text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-emerald-600"
          )

          if (to) {
            return (
              <Link key={id} to={to} className={className}>
                <Icon className="size-3.5" />
                {label}
              </Link>
            )
          }

          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange?.(id)}
              className={className}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          )
        })}
      </div>
    </header>
  )
}

export default Navbar
