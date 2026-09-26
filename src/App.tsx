import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { SearchFilterSection } from "@/sections/search-filter-section"
import { CardListingSection } from "@/sections/CardListingSection"
import Footer from "@/sections/Footer"
import { emptySearchFilters, filterHouses } from "@/lib/filter-houses"
import { fetchHouses } from "@/services/houses"
import type { House } from "@/data/sample-data"

export function App() {
  const [tab, setTab] = useState("home")
  const [filters, setFilters] = useState(emptySearchFilters)
  const [houses, setHouses] = useState<House[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchHouses()
      .then((data) => {
        if (cancelled) return
        setHouses(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to load houses")
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredHouses = filterHouses(houses, filters)

  return (
    <div>
      <Navbar
        activeTab={tab}
        onTabChange={setTab}
        notificationCount={3}
        messageCount={2}
        onNotificationClick={() => alert("notifications!")}
        onMessageClick={() => alert("messages!")}
        onProfileClick={() => alert("profile!")}
      />

      <div className="container mx-auto px-24 pt-8">
        <SearchFilterSection filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="container mx-auto px-24 py-12">
        {isLoading ? (
          <p className="py-16 text-center text-slate-500">Loading listings...</p>
        ) : error ? (
          <div role="alert" className="py-16 text-center">
            <p className="text-lg font-semibold text-slate-900">
              Failed to load listings
            </p>
            <p className="mt-1 text-sm text-slate-500">{error}</p>
          </div>
        ) : (
          <CardListingSection houses={filteredHouses} />
        )}
      </div>

      <Footer />
    </div>
  )
}

export default App
