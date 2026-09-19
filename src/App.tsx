import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { SearchFilterSection } from "@/sections/search-filter-section"
import { CardListingSection } from "@/sections/CardListingSection"
import Footer from "@/sections/Footer"
import houses from "@/data/sample-data"
import { emptySearchFilters, filterHouses } from "@/lib/filter-houses"

export function App() {
  const [tab, setTab] = useState("home")
  const [filters, setFilters] = useState(emptySearchFilters)
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
        <CardListingSection houses={filteredHouses} />
      </div>

      <Footer />
    </div>
  )
}

export default App
