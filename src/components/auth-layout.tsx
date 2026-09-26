import type { ComponentProps, ReactNode } from "react"
import { Link } from "react-router-dom"

import { Logo } from "@/components/logo"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AuthLayoutProps {
  // Page-specific background shapes, drawn behind the content.
  decorations: ReactNode
  className?: string
  children: ReactNode
}

// Shared shell for the login and register pages.
export function AuthLayout({
  decorations,
  className,
  children,
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-svh flex-col bg-muted/50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {decorations}
      </div>

      <header className="relative px-6 pt-8 sm:px-12">
        <Link to="/" aria-label="Go to home page">
          <Logo />
        </Link>
      </header>

      <main
        className={cn(
          "relative flex flex-1 flex-col items-center px-4 py-10 sm:py-16",
          className
        )}
      >
        {children}
      </main>
    </div>
  )
}

export function AuthCard({ className, ...props }: ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "w-full gap-0 rounded-panel px-6 py-7 shadow-[0_4px_20px_rgba(15,23,42,0.06)] ring-0 sm:px-8",
        className
      )}
      {...props}
    />
  )
}

export default AuthLayout
