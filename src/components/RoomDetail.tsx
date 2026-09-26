import {
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Layers,
  Maximize,
  Phone,
  Users,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { FALLBACK_ROOM_IMAGE } from "@/lib/rooms"
import type { House, Room } from "@/types/house-type"

interface RoomDetailProps {
  house: House
  room: Room
  onGoToPrevious: () => void
  onGoToNext: () => void
  hasPrevious: boolean
  hasNext: boolean
}

export function RoomDetail({
  house,
  room,
  onGoToPrevious,
  onGoToNext,
  hasPrevious,
  hasNext,
}: RoomDetailProps) {
  const specs = [
    { icon: Building2, label: "Floor", value: `Floor ${room.floor + 1}` },
    { icon: Maximize, label: "Size", value: `${room.sizeSqm} m²` },
    { icon: Users, label: "Sleeps", value: `${room.capacity} people` },
    { icon: BedDouble, label: "Bedding", value: room.bedType },
    {
      icon: Wallet,
      label: "Rent",
      value: `$${room.price} / month`,
    },
    {
      icon: Layers,
      label: "Reference",
      value: `R-${house.houseId}-${String(room.roomNumber).padStart(3, "0")}`,
    },
  ]

  return (
    <article
      role="tabpanel"
      id="room-panel"
      aria-labelledby={`room-tab-${room.roomId}`}
      className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="relative h-64 shrink-0 overflow-hidden bg-slate-200">
        <img
          key={room.image}
          src={room.image}
          alt={`Room ${room.roomNumber} of ${house.houseName}`}
          loading="lazy"
          decoding="async"
          onError={(event) => {
            const img = event.currentTarget
            if (img.src !== FALLBACK_ROOM_IMAGE) img.src = FALLBACK_ROOM_IMAGE
          }}
          className="h-full w-full object-cover"
        />

        <Badge
          variant={room.isAvailable ? "default" : "destructive"}
          className="absolute top-4 left-4 h-6 px-2.5"
        >
          {room.isAvailable ? <CheckCircle2 /> : <Clock />}
          {room.isAvailable ? "Available now" : "Currently occupied"}
        </Badge>

        <div className="absolute right-4 bottom-4 flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={onGoToPrevious}
            disabled={!hasPrevious}
            aria-label="Show previous room"
            className="h-9 w-9 rounded-full border-0 bg-white/85 text-slate-800 backdrop-blur-sm hover:bg-white"
          >
            <span aria-hidden="true">&larr;</span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={onGoToNext}
            disabled={!hasNext}
            aria-label="Show next room"
            className="h-9 w-9 rounded-full border-0 bg-white/85 text-slate-800 backdrop-blur-sm hover:bg-white"
          >
            <span aria-hidden="true">&rarr;</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
              Room {String(room.roomNumber).padStart(2, "0")} of{" "}
              {house.numberOfRoom}
            </p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-[0.02em] text-slate-900">
              {room.bedType}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <CalendarDays className="size-4 text-slate-400" />
              {room.availableFrom}
            </p>
          </div>

          <div className="text-right">
            <span className="block text-3xl font-extrabold text-slate-900">
              ${room.price}
            </span>
            <span className="text-sm text-slate-500">per month</span>
          </div>
        </header>

        <p className="text-sm leading-relaxed text-slate-600">
          {room.description}
        </p>

        <dl className="grid grid-cols-2 gap-3 border-y border-slate-200 py-4 sm:grid-cols-3">
          {specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-1">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <spec.icon className="size-3.5" />
                {spec.label}
              </dt>
              <dd className="text-sm font-semibold text-slate-900">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>

        <div>
          <h4 className="text-sm font-bold text-slate-900">Amenities</h4>
          <ul className="mt-2 flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <li key={amenity}>
                <Badge variant="outline" className="h-6 px-2.5">
                  {amenity}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Hosted by{" "}
            <strong className="font-semibold text-slate-900">
              {house.ownerName}
            </strong>
          </p>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-slate-200 px-4"
            >
              <Phone />
              {house.phoneNumber}
            </Button>
            <Button
              type="button"
              disabled={!room.isAvailable}
              className="h-10 rounded-full px-5"
            >
              {room.isAvailable ? "Book this room" : "Currently occupied"}
            </Button>
          </div>
        </footer>
      </div>
    </article>
  )
}

export default RoomDetail
