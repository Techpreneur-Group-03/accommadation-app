import { LogIn, LogOut, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { BLANK_ROUTE, navigateTo } from "@/lib/hash-route"

function initialsFromEmail(email: string | null | undefined): string {
  const localPart = email?.split("@")[0]
  if (!localPart) return "U"

  const parts = localPart.split(/[._-]+/).filter(Boolean)
  const first = parts[0]
  if (!first) return "U"
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()

  const second = parts[1]
  return `${first.charAt(0)}${second?.charAt(0) ?? ""}`.toUpperCase()
}

interface UserProfileMenuProps {
  avatarSrc?: string
  avatarAlt?: string
  userEmail?: string | null
  initials?: string
}

/**
 * Avatar trigger with the auth actions. There is no authentication yet, so
 * both actions simply route to the blank placeholder page until the real
 * sign in and sign out pages exist.
 */
export function UserProfileMenu({
  avatarSrc,
  avatarAlt = "User avatar",
  userEmail = null,
  initials,
}: UserProfileMenuProps) {
  const label = initials ?? initialsFromEmail(userEmail)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Profile"
        className="rounded-full transition-opacity hover:opacity-80"
      >
        <Avatar className="size-9">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={avatarAlt} /> : null}
          <AvatarFallback className="bg-emerald-100 text-sm font-semibold text-emerald-700">
            {label}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2">
            <User aria-hidden="true" />
            <span className="truncate">{userEmail ?? "Guest"}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigateTo(BLANK_ROUTE)}>
          <LogIn aria-hidden="true" />
          Sign In
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigateTo(BLANK_ROUTE)}>
          <LogOut aria-hidden="true" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
