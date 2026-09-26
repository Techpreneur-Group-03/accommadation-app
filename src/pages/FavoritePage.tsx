import { Heart, SearchX } from "lucide-react"

import { CardInfo } from "@/components/CardInfo"
import type { House } from "@/types/house-type"

interface FavoritePageProps {
  houses: House[]
  favoriteIds: Set<number>
  onToggleFavorite: (houseId: number) => void
}

export function FavoritePage({
  houses,
  favoriteIds,
  onToggleFavorite,
}: FavoritePageProps) {
  return (
    <section className="w-full" aria-label="Favorite accommodations">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium tracking-[0.2em] text-emerald-600 uppercase">
            Saved homes
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Your Favorite Listings
          </h1>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
          <Heart className="h-4 w-4 fill-current" />
          {houses.length} saved
        </div>
      </div>

      {houses.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <SearchX className="h-7 w-7 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            No favorites yet
          </h2>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Tap the heart icon on any listing to save it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
