
import { useEffect, useRef, useState } from "react"
import { Home, Heart, Megaphone, Users, Bell, MessageSquareMore } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessagePanel, NotificationPanel } from "@/components/notification-panel"

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
    onProfileClick,
    notificationCount = 0,
    messageCount = 0,
    userAvatarSrc = "/avatar.jpg",
    userInitials = "LN",
}: NavbarProps) {
    const [openPanel, setOpenPanel] = useState<"notifications" | "messages" | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node

            if (!panelRef.current?.contains(target)) {
                setOpenPanel(null)
            }
        }

        document.addEventListener("mousedown", handlePointerDown)
        return () => document.removeEventListener("mousedown", handlePointerDown)
    }, [])

    const handleNotificationToggle = () => {
        onNotificationClick?.()
        setOpenPanel((prev) => (prev === "notifications" ? null : "notifications"))
    }

    const handleMessageToggle = () => {
        onMessageClick?.()
        setOpenPanel((prev) => (prev === "messages" ? null : "messages"))
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
                <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
                    <span className="text-3xl font-bold">
                        <span className="text-emerald-600">SB</span>
                        <span className="text-orange-500">O</span>
                        <span className="text-emerald-600">V</span>
                    </span>

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

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleNotificationToggle}
                            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-emerald-600"
                            aria-label="Notifications"
                        >
                            <Bell className="size-5" />
                            {notificationCount > 0 && (
                                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleMessageToggle}
                            className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-emerald-600"
                            aria-label="Messages"
                        >
                            <MessageSquareMore className="size-5" />
                            {messageCount > 0 && (
                                <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-emerald-500" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onProfileClick}
                            className="rounded-full transition-opacity hover:opacity-80"
                            aria-label="Profile"
                        >
                            <Avatar className="size-9">
                                <AvatarImage src={userAvatarSrc} alt="User avatar" />
                                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-sm">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </div>
                </div>

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

            {openPanel === "notifications" && (
                <div ref={panelRef} className="fixed right-4 top-20 z-[60] md:right-8 xl:right-20">
                    <NotificationPanel />
                </div>
            )}

            {openPanel === "messages" && (
                <div ref={panelRef} className="fixed right-4 top-20 z-[60] md:right-8 xl:right-20">
                    <MessagePanel />
                </div>
            )}
        </>
    )
}

export default Navbar
