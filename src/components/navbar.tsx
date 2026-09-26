
import { Home, Heart, Megaphone, Users, Bell, MessageSquareMore } from "lucide-react"
import { UserProfileMenu } from "@/components/user-profile-menu"

import { cn } from "@/lib/utils"

const NAV_ITEMS = [
    { id: "home", label: "Home", icon: Home },
    { id: "favorite", label: "Favorite", icon: Heart },
    { id: "announcement", label: "Announcement", icon: Megaphone },
    { id: "about-us", label: "About Us", icon: Users },
]

interface NavbarProps {
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
}: NavbarProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-4 sm:px-6">

                {/* Logo */}
                <span className="text-3xl font-bold">
                    <span className="text-emerald-600">SB</span>
                    <span className="text-orange-500">O</span>
                    <span className="text-emerald-600">V</span>
                </span>

                {/* Nav Links */}
                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                        const isActive = activeTab === id
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onTabChange?.(id)}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-emerald-600 text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-emerald-600"
                                )}
                            >
                                <Icon className="size-4" />
                                {label}
                            </button>
                        )
                    })}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Notification */}
                    <button
                        type="button"
                        onClick={onNotificationClick}
                        className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-emerald-600"
                        aria-label="Notifications"
                    >
                        <Bell className="size-5" />
                        {notificationCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />
                        )}
                    </button>

                    {/* Messages */}
                    <button
                        type="button"
                        onClick={onMessageClick}
                        className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-emerald-600"
                        aria-label="Messages"
                    >
                        <MessageSquareMore className="size-5" />
                        {messageCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-emerald-500" />
                        )}
                    </button>

                    {/* Profile / auth actions */}
                    <UserProfileMenu
                        avatarSrc={userAvatarSrc}
                        initials={userInitials}
                    />
                </div>
            </div>

            {/* Mobile Nav */}
            <div className="flex gap-1 overflow-x-auto border-t px-4 py-2 md:hidden">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id
                    return (
                        <button
                            key={id}
                            type="button"
                            onClick={() => onTabChange?.(id)}
                            className={cn(
                                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                                isActive
                                    ? "bg-emerald-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-emerald-600"
                            )}
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
