import type { ReactNode } from "react"
import { ArrowLeft, LoaderCircle, type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// White rounded panel used for each owner portal page (see the dashboard's
// "Registration Request" panel in the design).
export function OwnerPanel({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <section
      className={cn(
        "rounded-panel bg-card p-5 shadow-[0_4px_20px_rgba(15,23,42,0.04)] sm:p-8",
        className
      )}
    >
      {children}
    </section>
  )
}

interface PanelHeaderProps {
  title: ReactNode
  description?: ReactNode
  backTo?: string
  actions?: ReactNode
  className?: string
}

export function PanelHeader({
  title,
  description,
  backTo,
  actions,
  className,
}: PanelHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end", className)}
    >
      <div className="min-w-0 flex-1">
        {backTo && (
          <Link
            to={backTo}
            className="mb-3 flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
          >
            <ArrowLeft className="size-4" />
            Back
          </Link>
        )}
        <h2 className="font-heading text-2xl font-bold text-brand">{title}</h2>
        {description && (
          <div className="mt-1 text-sm text-muted-foreground">
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number | string
  hint?: string
  icon: LucideIcon
}

export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-panel border-2 border-brand-dark/15 bg-card px-6 py-5">
      <div>
        <p className="text-sm text-foreground/80">{label}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="font-heading text-3xl font-semibold text-brand-dark">
            {value}
          </span>
          {hint && <span className="text-xs text-brand">{hint}</span>}
        </p>
      </div>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
        <Icon className="size-5" />
      </span>
    </div>
  )
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"
    >
      <LoaderCircle className="size-5 animate-spin text-brand" />
      {label}
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 py-16 text-center"
    >
      <p className="font-semibold text-foreground">Something went wrong</p>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand/10">
        <Icon className="size-7 text-brand" />
      </span>
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  )
}
