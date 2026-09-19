import { CardInfo } from '@/components/CardInfo'
import houses from '@/data/sample-data'

export function CardListingSection() {
  return (
    <section className="w-full" aria-label="Accommodation listings">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Available Accommodations
        </h1>
        <span className="text-sm text-slate-500">
          {houses.length} listings found
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {houses.map((house) => (
          <CardInfo
            key={house.houseId}
            houseName={house.houseName}
            location={house.location}
            numberOfRoom={house.numberOfRoom}
            pricePerRoom={house.pricePerRoom}
            rate={house.rate}
            phoneNumber={house.phoneNumber}
            ownerName={house.ownerName}
          />
        ))}
      </div>
    </section>
  )
}
