import * as React from "react"

import { BlankPage } from "@/components/blank-page"
import { BLANK_ROUTE, useCurrentPath } from "@/lib/hash-route"

/**
 * Renders the blank placeholder route, or `children` for every other path.
 * Temporary stand-in for real routing.
 */
export function HashRouter({ children }: { children: React.ReactNode }) {
  const path = useCurrentPath()

  if (path === BLANK_ROUTE) {
    return <BlankPage />
  }

  return <>{children}</>
}
