import { Link } from "react-router-dom"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <main className="container mx-auto px-24 py-16">
      <div className="flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <SearchX className="h-7 w-7 text-slate-400" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-[0.02em] text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          The page you are looking for doesn't exist. Head back to the listings
          to find a place to stay.
        </p>
        <Button
          render={<Link to="/" />}
          variant="outline"
          className="mt-6 h-10 rounded-full border-slate-200 px-5"
        >
          Back to listings
        </Button>
      </div>
    </main>
  )
}

export default NotFoundPage
