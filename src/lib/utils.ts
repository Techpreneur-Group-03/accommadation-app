export { cn } from "cn"

// "Sok Dara" -> "SD", "dara@example.com" -> "D"
export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

// 80 -> "$80", 0.75 -> "$0.75"
export function formatPrice(value: number) {
  return currencyFormatter.format(value)
}
