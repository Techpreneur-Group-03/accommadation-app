import { CircleDollarSign, House, ImageOff, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import {
  availableRooms,
  coverImage,
  priceFrom,
  type OwnerHouse,
} from "@/services/listings"

// One house in the owner's listings grid (design: "Owner's Listings").
export function ListingCard({ house }: { house: OwnerHouse }) {
  const cover = coverImage(house)
  const price = priceFrom(house)
  const freeRooms = availableRooms(house).length

  return (
    <Link
      to={`/admin/listings/${house.id}`}
      className="group flex flex-col gap-5 rounded-panel bg-card p-4 shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow outline-none hover:shadow-[0_8px_28px_rgba(15,23,42,0.14)] focus-visible:ring-3 focus-visible:ring-brand/40 sm:flex-row sm:items-center"
    >
      {cover ? (
        <img
          src={cover.url}
          alt=""
          className="aspect-5/4 w-full shrink-0 rounded-2xl object-cover sm:w-52 lg:w-60"
        />
      ) : (
        <span className="flex aspect-5/4 w-full shrink-0 items-center justify-center rounded-2xl bg-muted sm:w-52 lg:w-60">
          <ImageOff className="size-8 text-muted-foreground" />
        </span>
      )}

      <div className="flex min-w-0 flex-col gap-2.5 pb-2 sm:pb-0">
        <h3 className="truncate font-heading font-bold tracking-wide text-brand uppercase group-hover:underline">
          {house.houseName}
        </h3>
        <p className="flex items-center gap-2 text-sm text-foreground/80">
          <MapPin className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{house.location}</span>
        </p>
        <p className="flex items-center gap-2 text-sm text-foreground/80">
          <House className="size-4 shrink-0 text-muted-foreground" />
          {freeRooms} {freeRooms === 1 ? "room" : "rooms"} available
        </p>
        <p className="flex items-center gap-2 text-sm text-foreground/80">
          <CircleDollarSign className="size-4 shrink-0 text-muted-foreground" />
          {price === null ? "No rooms" : `${formatPrice(price)} / month`}
        </p>
        {!house.isPublished && (
          <Badge variant="secondary" className="w-fit">
            Hidden from customers
          </Badge>
        )}
      </div>
    </Link>
  )
}

export default ListingCard
