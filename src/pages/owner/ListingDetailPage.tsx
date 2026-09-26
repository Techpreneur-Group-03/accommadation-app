import { useState } from "react"
import { format } from "date-fns"
import {
  BedDouble,
  Box,
  Building2,
  CircleDollarSign,
  House,
  Layers,
  MapPin,
  Pencil,
  Phone,
  Receipt,
  Scaling,
  Trash2,
  UsersRound,
  Wallet,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { useAuth } from "@/components/auth-provider"
import {
  brandActionClassName,
  brandSwitchClassName,
  pillToggleClassName,
} from "@/components/field-styles"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useOwnerHouse } from "@/hooks/use-owner-houses"
import { cn, formatPrice, getInitials } from "@/lib/utils"
import { DeleteListingDialog } from "@/sections/owner/delete-listing-dialog"
import { HouseGallery } from "@/sections/listing/house-gallery"
import {
  AdditionalInformation,
  InfoRow,
  RoomPhotos,
  SectionTitle,
} from "@/sections/listing/listing-parts"
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OwnerPanel,
  PanelHeader,
} from "@/sections/owner/owner-panel"
import {
  availableRooms,
  houseImages,
  priceFrom,
  roomImages,
  setListingPublished,
  setRoomAvailable,
  type OwnerHouse,
  type Room,
} from "@/services/listings"

function ListingDetail({
  house,
  onChanged,
}: {
  house: OwnerHouse
  onChanged: () => void
}) {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [pending, setPending] = useState<"publish" | number | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const floors = [...new Set(house.rooms.map((room) => room.floorNumber))]
  // Fall back to the first room, e.g. after the selected one was deleted.
  const room: Room | undefined =
    house.rooms.find((item) => item.id === selectedRoomId) ?? house.rooms[0]
  const floorRooms = house.rooms.filter(
    (item) => item.floorNumber === room?.floorNumber
  )
  const freeRooms = availableRooms(house).length
  const price = priceFrom(house)
  const ownerName = profile?.fullName ?? user?.email ?? ""

  const run = async (
    key: "publish" | number,
    action: () => Promise<void>,
    success: string
  ) => {
    setPending(key)
    try {
      await action()
      toast.success(success)
      onChanged()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setPending(null)
    }
  }

  return (
    <OwnerPanel className="flex flex-col gap-8">
      <PanelHeader
        backTo="/admin/listings"
        title={<span className="uppercase">{house.houseName}</span>}
        description={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="flex items-center gap-1.5">
              <House className="size-4" />
              {freeRooms} of {house.rooms.length}{" "}
              {house.rooms.length === 1 ? "room" : "rooms"} available
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {house.location}
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
        }
        actions={
          <>
            <Button
              render={<Link to={`/admin/listings/${house.id}/edit`} />}
              nativeButton={false}
              className={brandActionClassName}
            >
              <Pencil />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="h-9 gap-2 px-4"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 />
              Delete
            </Button>
          </>
        }
      />

      <div className="flex items-center gap-3 rounded-xl bg-muted/60 px-4 py-3">
        <Switch
          id="published"
          checked={house.isPublished}
          disabled={pending === "publish"}
          onCheckedChange={(checked) =>
            run(
              "publish",
              () => setListingPublished(house.id, checked),
              checked ? "Listing is visible to customers" : "Listing hidden"
            )
          }
          className={brandSwitchClassName}
        />
        <Label htmlFor="published" className="font-normal">
          {house.isPublished
            ? freeRooms > 0
              ? "Visible to customers"
              : "Published, but hidden from customers while every room is occupied"
            : "Hidden from customers"}
        </Label>
      </div>

      <HouseGallery images={houseImages(house)} houseName={house.houseName} />

      {floors.length > 1 && (
        <section className="flex flex-col gap-4">
          <SectionTitle className="border-b pb-3">Floor Options</SectionTitle>
          <ToggleGroup
            aria-label="Floor"
            spacing={3}
            value={room ? [String(room.floorNumber)] : []}
            onValueChange={(value) => {
              const floor = Number(value[0])
              const first = house.rooms.find(
                (item) => item.floorNumber === floor
              )
              if (first) setSelectedRoomId(first.id)
            }}
            className="flex-wrap rounded-2xl border-2 border-brand/25 p-4"
          >
            {floors.map((floor) => (
              <ToggleGroupItem
                key={floor}
                value={String(floor)}
                className={pillToggleClassName}
              >
                <Layers />
                Floor {floor}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>
      )}

      {house.rooms.length > 1 && (
        <section className="flex flex-col gap-4">
          <SectionTitle className="border-b pb-3">Room Options</SectionTitle>
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
                className={cn(
                  pillToggleClassName,
                  !item.isAvailable && "opacity-60"
                )}
                title={item.isAvailable ? undefined : "Occupied"}
              >
                <BedDouble />
                Room {item.roomNumber}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </section>
      )}

      {room && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <RoomPhotos
            key={room.id}
            images={roomImages(house, room.id)}
            roomLabel={`Room ${room.roomNumber}`}
          />

          <aside className="flex flex-col gap-5 rounded-2xl border-2 border-brand/40 p-6">
            <h3 className="font-heading font-semibold tracking-wide text-brand uppercase">
              Room Information
            </h3>
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

            <div className="flex items-center gap-3">
              <Switch
                id="room-available"
                checked={room.isAvailable}
                disabled={pending === room.id}
                onCheckedChange={(checked) =>
                  run(
                    room.id,
                    () => setRoomAvailable(room.id, checked),
                    `Room ${room.roomNumber} marked ${checked ? "available" : "occupied"}`
                  )
                }
                className={brandSwitchClassName}
              />
              <Label htmlFor="room-available" className="font-normal">
                {room.isAvailable ? "Available" : "Occupied"}
              </Label>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <Avatar className="size-11">
                <AvatarFallback className="bg-brand/15 font-semibold text-brand">
                  {getInitials(ownerName)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate font-medium">{ownerName}</p>
                {profile?.phoneNumber && (
                  <p className="flex items-center gap-1.5 text-xs text-brand">
                    <Phone className="size-3" />
                    {profile.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      <AdditionalInformation house={house} />

      <DeleteListingDialog
        house={isDeleteOpen ? house : null}
        onOpenChange={setIsDeleteOpen}
        onDeleted={() => navigate("/admin/listings")}
      />
    </OwnerPanel>
  )
}

// /admin/listings/:id
export function ListingDetailPage() {
  const { id } = useParams()
  const { data: house, error, isLoading, reload } = useOwnerHouse(Number(id))

  if (isLoading) {
    return (
      <OwnerPanel>
        <LoadingState label="Loading listing..." />
      </OwnerPanel>
    )
  }
  if (error) {
    return (
      <OwnerPanel>
        <ErrorState message={error} onRetry={reload} />
      </OwnerPanel>
    )
  }
  if (!house) {
    return (
      <OwnerPanel>
        <EmptyState
          icon={Building2}
          title="Listing not found"
          description="It may have been deleted, or it belongs to another owner."
          action={
            <Button
              variant="outline"
              render={<Link to="/admin/listings" />}
              nativeButton={false}
            >
              Back to My Listings
            </Button>
          }
        />
      </OwnerPanel>
    )
  }

  return <ListingDetail house={house} onChanged={reload} />
}

export default ListingDetailPage
