import * as React from "react"

/**
 * Minimal hash based routing.
 *
 * The project has no router installed and package.json is out of scope for
 * this change, so this stands in for react-router until the team agrees on
 * one. Swap it for real routes at that point.
 */

export const BLANK_ROUTE = "/blank"
export const HOME_ROUTE = "/"

function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, "")
  return hash.length > 0 ? hash : HOME_ROUTE
}

export function navigateTo(path: string): void {
  window.location.hash = `#${path}`
}

export function useCurrentPath(): string {
  const [path, setPath] = React.useState(currentPath)

  React.useEffect(() => {
    const handleChange = () => setPath(currentPath())
    window.addEventListener("hashchange", handleChange)
    return () => window.removeEventListener("hashchange", handleChange)
  }, [])

  return path
}
