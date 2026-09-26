import { useState, type ReactNode } from "react"
import { format } from "date-fns"
import {
  ArrowLeft,
  Ban,
  BedDouble,
  Box,
  ChevronDown,
  CircleDollarSign,
  Heart,
  House,
  Layers,
  MapPin,
  MessagesSquare,
  Phone,
  Receipt,
  Scaling,
  SearchX,
  UsersRound,
  Wallet,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { pillToggleClassName } from "@/components/field-styles"
import { SiteNavbar } from "@/components/site-navbar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useAsyncData } from "@/hooks/use-async-data"
import { cn, formatPrice, getInitials } from "@/lib/utils"
import Footer from "@/sections/Footer"
import { HouseGallery } from "@/sections/listing/house-gallery"
import {
  AdditionalInformation,
  InfoRow,
  RoomPhotos,
  SectionTitle,
} from "@/sections/listing/listing-parts"
import { LoadingState } from "@/sections/owner/owner-panel"
import {
  availableRooms,
  fetchPublicListing,
  houseImages,
  priceFrom,
  roomImages,
  type PublicListing,
  type Room,
} from "@/services/listings"

// Floors or rooms that can't be picked: shown in red with a "no" icon.
const unavailablePillClassName =
  "border-destructive/50 text-destructive/80 disabled:opacity-100"

function ChoiceSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <Collapsible defaultOpen render={<section />} className="flex flex-col">
      {/* Button inside the heading (not the reverse) keeps valid HTML. */}
      <SectionTitle className="border-b pb-3">
        <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-sm text-left uppercase outline-none focus-visible:ring-3 focus-visible:ring-brand/40">
          {title}
          <ChevronDown className="size-5 rounded-full border border-brand-dark/60 p-0.5 text-brand-dark transition-transform group-data-panel-open:rotate-180" />
        </CollapsibleTrigger>
      </SectionTitle>
      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <div className="pt-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function ListingView({ listing }: { listing: PublicListing }) {
  const { house, ownerName, ownerPhone } = listing
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  // Not saved yet, like the heart on the home page cards.
  const [isFavorite, setIsFavorite] = useState(false)

  const freeRooms = availableRooms(house)
  const floors = [...new Set(house.rooms.map((room) => room.floorNumber))]
  const isFloorFull = (floor: number) =>
    !house.rooms.some((room) => room.floorNumber === floor && room.isAvailable)

  // Start on the first available room; the listing always has one.
  const room: Room | undefined =
    house.rooms.find((item) => item.id === selectedRoomId) ??
    freeRooms[0] ??
    house.rooms[0]
  const floorRooms = house.rooms.filter(
    (item) => item.floorNumber === room?.floorNumber
  )
  const price = priceFrom(house)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link
          to="/"
          className="mb-3 flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-heading text-2xl font-bold tracking-wide text-brand uppercase sm:text-3xl">
            {house.houseName}
          </h1>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label={isFavorite ? "Remove from favorites" : "Save listing"}
            aria-pressed={isFavorite}
            onClick={() => setIsFavorite((value) => !value)}
            className="size-10 shrink-0 rounded-full bg-card shadow-md hover:bg-card"
          >
            <Heart
              className={cn(
                "size-5 transition-colors",
                isFavorite ? "fill-rose-500 text-rose-500" : "text-slate-700"
              )}
            />
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {house.location}
          </span>
          <span className="flex items-center gap-1.5">
            <House className="size-4" />
            {freeRooms.length} {freeRooms.length === 1 ? "room" : "rooms"}{" "}
            available
          </span>
          {price !== null && (
            <span className="flex items-center gap-1.5">
              <CircleDollarSign className="size-4" />
              Start from: {formatPrice(price)} / room
            </span>
          )}
          <span className="text-muted-foreground/70">
            · edited at {format(new Date(house.updatedAt), "dd/MM/yyyy")}
          </span>
        </div>
      </div>

      <HouseGallery images={houseImages(house)} houseName={house.houseName} />

      {floors.length > 1 && (
        <ChoiceSection title="Which floor do you want?">
          <ToggleGroup
            aria-label="Floor"
            spacing={3}
            value={room ? [String(room.floorNumber)] : []}
            onValueChange={(value) => {
              const floor = Number(value[0])
              const first = house.rooms.find(
                (item) => item.floorNumber === floor && item.isAvailable
              )
              if (first) setSelectedRoomId(first.id)
            }}
            className="flex-wrap rounded-2xl border-2 border-brand/25 p-4"
          >
            {floors.map((floor) => {
              const isFull = isFloorFull(floor)
              return (
                <ToggleGroupItem
                  key={floor}
                  value={String(floor)}
                  disabled={isFull}
                  className={cn(
                    pillToggleClassName,
                    isFull && unavailablePillClassName
                  )}
                >
                  {isFull ? <Ban /> : <Layers />}
                  Floor {floor}
                  {isFull && <span className="sr-only">(fully booked)</span>}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
        </ChoiceSection>
      )}

      {house.rooms.length > 1 && (
        <ChoiceSection title="Which room do you want?">
          <ToggleGroup
            aria-label="Room"
            spacing={3}
            value={room ? [String(room.id)] : []}
            onValueChange={(value) => {
              if (value[0]) setSelectedRoomId(Number(value[0]))
            }}
            className="flex-wrap rounded-2xl border-2 border-brand/25 p-4"
          >
            {floorRooms.map((item) => (
              <ToggleGroupItem
                key={item.id}
                value={String(item.id)}
                disabled={!item.isAvailable}
                className={cn(
                  pillToggleClassName,
                  !item.isAvailable && unavailablePillClassName
                )}
              >
                {item.isAvailable ? <BedDouble /> : <Ban />}
                Room {item.roomNumber}
                {!item.isAvailable && (
                  <span className="sr-only">(occupied)</span>
                )}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </ChoiceSection>
      )}

      {room && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <RoomPhotos
            key={room.id}
            images={roomImages(house, room.id)}
            roomLabel={`Room ${room.roomNumber}`}
          />

          <aside className="flex flex-col gap-5 rounded-2xl border-2 border-brand/40 bg-card p-6">
            <h2 className="font-heading font-semibold tracking-wide text-brand uppercase">
              Room Information
            </h2>
            <InfoRow icon={Box} value={room.roomNumber} label="room number" />
            <InfoRow
              icon={Wallet}
              value={formatPrice(room.monthlyPrice)}
              label="monthly payment"
            />
            <InfoRow
              icon={Receipt}
              value={formatPrice(room.bookingFee)}
              label="booking fee"
            />
            <InfoRow
              icon={Layers}
              value={room.floorNumber}
              label="floor number"
            />
            <InfoRow
              icon={Scaling}
              value={
                room.widthM !== null && room.lengthM !== null
                  ? `${room.widthM}m × ${room.lengthM}m`
                  : "Not set"
              }
              label="room dimension"
            />
            <InfoRow
              icon={UsersRound}
              value={room.peoplePerRoom}
              label="people per room"
            />

            {/* Online booking isn't built yet. */}
            <div className="flex flex-col gap-2">
              <Button
                disabled
                className="h-10 w-full rounded-lg bg-brand text-brand-foreground"
              >
                Book a room
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Online booking is coming soon. Call the owner to book.
              </p>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Avatar className="size-11">
                <AvatarFallback className="bg-brand/15 font-semibold text-brand">
                  {getInitials(ownerName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{ownerName}</p>
                {ownerPhone && (
                  <a
                    href={`tel:${ownerPhone.replace(/\s+/g, "")}`}
                    className="flex w-fit items-center gap-1.5 text-xs text-brand hover:underline"
                  >
                    <Phone className="size-3" />
                    {ownerPhone}
                  </a>
                )}
              </div>
              <span title="Chat (coming soon)" className="text-brand/50">
                <MessagesSquare className="size-5" />
              </span>
            </div>
          </aside>
        </div>
      )}

      <AdditionalInformation house={house} />
    </div>
  )
}

// /listings/:id — a listing as customers see it.
export function ListingPage() {
  const { id } = useParams()
  const houseId = Number(id)
  const { data, error, isLoading, reload } = useAsyncData(
    `listing:${id}`,
    () =>
      Number.isInteger(houseId)
        ? fetchPublicListing(houseId)
        : Promise.resolve(null)
  )

  return (
    <div className="flex min-h-svh flex-col bg-muted/40">
      <SiteNavbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        {isLoading ? (
          <LoadingState label="Loading listing..." />
        ) : error ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <p className="font-semibold text-foreground">
              Failed to load this listing
            </p>
            <p className="max-w-md text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={reload}>
              Try again
            </Button>
          </div>
        ) : !data ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-brand/10">
              <SearchX className="size-7 text-brand" />
            </span>
            <p className="text-lg font-semibold">
              This listing isn&apos;t available
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              It may be fully booked, hidden by the owner, or removed.
            </p>
            <Button
              render={<Link to="/" />}
              nativeButton={false}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              Browse other places
            </Button>
          </div>
        ) : (
          <ListingView listing={data} />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default ListingPage
