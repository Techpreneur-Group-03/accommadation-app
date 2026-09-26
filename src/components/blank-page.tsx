import { Button } from "@/components/ui/button"

import { HOME_ROUTE, navigateTo } from "@/lib/hash-route"

/**
 * Placeholder destination for the Sign In and Sign Out actions, which have no
 * dedicated pages yet. Replace with the real auth pages once they exist.
 */
export function BlankPage() {
  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Blank page</h1>
      <p className="max-w-sm text-sm text-slate-500">
        Placeholder route. The dedicated sign in and sign out pages have not
        been built yet.
      </p>
      <Button variant="outline" onClick={() => navigateTo(HOME_ROUTE)}>
        Back to home
      </Button>
    </main>
  )
}
