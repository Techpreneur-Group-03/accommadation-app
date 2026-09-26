import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowLeft,
  BedDouble,
  House as HouseIcon,
  MapPin,
  SearchX,
  Star,
  Users,
  Wallet,
} from "lucide-react"

import { RoomDetail } from "@/components/RoomDetail"
import { RoomSelector } from "@/components/RoomSelector"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { generateRooms } from "@/lib/rooms"
import { fetchHouseById } from "@/services/houses"
import type { House } from "@/types/house-type"

interface HouseResult {
  houseId: number
  house: House | null
  error: string | null
}

function HouseNotFound({ message }: { message?: string }) {
  return (
    <main className="container mx-auto px-24 py-16">
      <div
        role="alert"
        className="flex flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <SearchX className="h-7 w-7 text-slate-400" />
        </div>
        <h1 className="text-lg font-semibold text-slate-900">
          House not found
        </h1>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          {message ??
            "This listing may have been removed or the link is incorrect."}
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

function HouseOverview({ house }: { house: House }) {
  const rooms = useMemo(() => generateRooms(house), [house])
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0].roomId)

  const requestedIndex = rooms.findIndex(
    (room) => room.roomId === selectedRoomId
  )
  const selectedIndex = requestedIndex === -1 ? 0 : requestedIndex
  const selectedRoom = rooms[selectedIndex]
  const lowestPrice = Math.min(...rooms.map((room) => room.price))

  const stats = [
    { icon: BedDouble, label: "Rooms", value: house.numberOfRoom },
    { icon: Users, label: "Per room", value: house.peoplePerRoom },
    { icon: Wallet, label: "From", value: `$${lowestPrice}` },
  ]

  const goToRoom = (index: number) => {
    const target = rooms[index]
    if (target) setSelectedRoomId(target.roomId)
  }

  return (
    <main className="container mx-auto px-24 py-8">
      <nav aria-label="Breadcrumb">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to all listings
        </Link>
      </nav>

      <header className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-[0.02em] text-slate-900">
              {house.houseName}
            </h1>
            {house.rate !== undefined && (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1.5 text-xs font-bold text-slate-800"
                aria-label={`Rating ${house.rate} out of 5`}
              >
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {house.rate}
              </span>
            )}
          </div>

          <p className="flex items-center gap-2 text-slate-500">
            <MapPin className="size-4 text-slate-400" />
            {house.location}
          </p>
        </div>

        <ul className="flex flex-wrap gap-3">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5"
            >
              <stat.icon className="size-4 text-slate-400" />
              <span className="flex flex-col">
                <span className="text-xs text-slate-500">{stat.label}</span>
                <span className="text-sm font-bold text-slate-900">
                  {stat.value}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-slate-200">
        <img
          src={house.houseImage}
          alt={`Exterior of ${house.houseName}`}
          decoding="async"
          onError={(event) => {
            const img = event.currentTarget
            if (img.src !== "https://via.placeholder.com/400x300?text=No+Image")
              img.src = "https://via.placeholder.com/400x300?text=No+Image"
          }}
          className="h-72 w-full object-cover lg:h-96"
        />
      </div>

      <section
        aria-label="Rooms"
        className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]"
      >
        <aside className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <HouseIcon className="size-5 text-brand" />
              Choose a room
            </h2>
            <Badge variant="secondary">{rooms.length} rooms</Badge>
          </div>

          <p className="text-sm text-slate-500">
            Every room is listed separately. Pick one to see its full details,
            pricing and availability.
          </p>

          <RoomSelector
            rooms={rooms}
            selectedRoomId={selectedRoom.roomId}
            onSelect={setSelectedRoomId}
          />
        </aside>

        <RoomDetail
          house={house}
          room={selectedRoom}
          hasPrevious={selectedIndex > 0}
          hasNext={selectedIndex < rooms.length - 1}
          onGoToPrevious={() => goToRoom(selectedIndex - 1)}
          onGoToNext={() => goToRoom(selectedIndex + 1)}
        />
      </section>
    </main>
  )
}

export function HouseDetailPage() {
  const { houseId } = useParams<{ houseId: string }>()
  const parsedId = Number(houseId)
  const isValidId = Number.isInteger(parsedId) && parsedId > 0

  const [result, setResult] = useState<HouseResult | null>(null)

  useEffect(() => {
    if (!isValidId) return

    let cancelled = false

    fetchHouseById(parsedId)
      .then((data) => {
        if (cancelled) return
        setResult({ houseId: parsedId, house: data, error: null })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setResult({
          houseId: parsedId,
          house: null,
          error:
            err instanceof Error ? err.message : "Failed to load this house",
        })
      })

    return () => {
      cancelled = true
    }
  }, [isValidId, parsedId])

  if (!isValidId) {
    return <HouseNotFound />
  }

  if (!result || result.houseId !== parsedId) {
    return (
      <main className="container mx-auto px-24 py-16">
        <p className="text-center text-slate-500">Loading house details...</p>
      </main>
    )
  }

  if (!result.house) {
    return <HouseNotFound message={result.error ?? undefined} />
  }

  return <HouseOverview key={result.house.houseId} house={result.house} />
}

export default HouseDetailPage
