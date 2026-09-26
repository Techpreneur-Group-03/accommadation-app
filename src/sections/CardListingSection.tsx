import { SearchX } from "lucide-react"

import { CardInfo } from "@/components/CardInfo"
import type { House } from "@/types/house-type"

interface CardListingSectionProps {
  houses: House[]
  favoriteIds: Set<number>
  onToggleFavorite: (houseId: number) => void
}

export function CardListingSection({
  houses,
  favoriteIds,
  onToggleFavorite,
}: CardListingSectionProps) {
  return (
    <section className="w-full  " aria-label="Accommodation listings">
      <div className="mb-6 mx-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Available Accommodations
        </h1>
        <span className="text-sm text-slate-500">
          {houses.length} listings found
        </span>
      </div>

      {houses.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <SearchX className="h-7 w-7 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            No accommodations found
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            We couldn't find any places that match your search. Try a different
            keyword or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 mx-10 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {houses.map((house) => (
            <CardInfo
              key={house.houseId}
              houseId={house.houseId}
              houseName={house.houseName}
              location={house.location}
              numberOfRoom={house.numberOfRoom}
              pricePerRoom={house.pricePerRoom}
              rate={house.rate}
              phoneNumber={house.phoneNumber}
              houseImage={house.houseImage}
              ownerName={house.ownerName}
              isFavorite={favoriteIds.has(house.houseId)}
              onToggleFavorite={() => onToggleFavorite(house.houseId)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
