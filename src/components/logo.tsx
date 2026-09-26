import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-3xl font-bold", className)}>
      <span className="text-emerald-600">SB</span>
      <span className="text-orange-500">O</span>
      <span className="text-emerald-600">V</span>
    </span>
  )
}

export default Logo
