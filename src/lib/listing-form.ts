import type { OwnerHouse } from "@/services/listings"

// A photo in the form: already uploaded, or picked and optimized but not yet
// uploaded (previewUrl is an object URL that must be revoked).
export type ImageEntry =
  | { kind: "existing"; key: string; id: number; url: string }
  | { kind: "new"; key: string; blob: Blob; previewUrl: string }

// Form values are strings so number inputs can be empty.
export interface RoomDraft {
  key: string
  id?: number
  floorNumber: string
  roomNumber: string
  monthlyPrice: string
  bookingFee: string
  width: string
  length: string
  peoplePerRoom: string
  isAvailable: boolean
  images: ImageEntry[]
}

export interface ListingDraft {
  houseName: string
  location: string
  description: string
  waterPrice: string
  electricityPrice: string
  isPublished: boolean
  images: ImageEntry[]
  rooms: RoomDraft[]
}

export type RoomErrors = Partial<Record<keyof RoomDraft, string>>

export interface ListingErrors {
  houseName?: string
  location?: string
  waterPrice?: string
  electricityPrice?: string
  images?: string
  rooms?: Record<string, RoomErrors>
}

export const newKey = () => crypto.randomUUID()

// Floor and room default to 1: a small house is a single room.
export function newRoomDraft(floorNumber = "1", roomNumber = ""): RoomDraft {
  return {
    key: newKey(),
    floorNumber,
    roomNumber,
    monthlyPrice: "",
    bookingFee: "",
    width: "",
    length: "",
    peoplePerRoom: "1",
    isAvailable: true,
    images: [],
  }
}

export function emptyListingDraft(): ListingDraft {
  return {
    houseName: "",
    location: "",
    description: "",
    waterPrice: "",
    electricityPrice: "",
    isPublished: true,
    images: [],
    rooms: [newRoomDraft("1", "1")],
  }
}

const toInput = (value: number | null) => (value === null ? "" : String(value))

export function draftFromHouse(house: OwnerHouse): ListingDraft {
  const toEntry = (image: OwnerHouse["images"][number]): ImageEntry => ({
    kind: "existing",
    key: `image-${image.id}`,
    id: image.id,
    url: image.url,
  })

  return {
    houseName: house.houseName,
    location: house.location,
    description: house.description ?? "",
    waterPrice: toInput(house.waterPrice),
    electricityPrice: toInput(house.electricityPrice),
    isPublished: house.isPublished,
    images: house.images.filter((image) => image.roomId === null).map(toEntry),
    rooms: house.rooms.map((room) => ({
      key: `room-${room.id}`,
      id: room.id,
      floorNumber: String(room.floorNumber),
      roomNumber: room.roomNumber,
      monthlyPrice: String(room.monthlyPrice),
      bookingFee: String(room.bookingFee),
      width: toInput(room.widthM),
      length: toInput(room.lengthM),
      peoplePerRoom: String(room.peoplePerRoom),
      isAvailable: room.isAvailable,
      images: house.images
        .filter((image) => image.roomId === room.id)
        .map(toEntry),
    })),
  }
}

// Every object URL in the draft, for cleanup when the form closes.
export function draftPreviewUrls(draft: ListingDraft): string[] {
  return [draft.images, ...draft.rooms.map((room) => room.images)]
    .flat()
    .flatMap((image) => (image.kind === "new" ? [image.previewUrl] : []))
}

// Empty string -> null. Non-numeric input -> NaN, caught by validation.
export function parseNumber(value: string): number | null {
  const trimmed = value.trim()
  return trimmed === "" ? null : Number(trimmed)
}

export function floorOf(room: RoomDraft): number {
  return parseNumber(room.floorNumber) ?? 1
}

function checkNumber(
  value: string,
  { required = false, min = 0, integer = false, label = "Value" } = {}
): string | undefined {
  const number = parseNumber(value)
  if (number === null) return required ? `${label} is required` : undefined
  if (Number.isNaN(number)) return "Enter a number"
  if (integer && !Number.isInteger(number)) return "Enter a whole number"
  if (number < min) return `Must be ${min} or more`
}

function validateRoom(room: RoomDraft): RoomErrors {
  const errors: RoomErrors = {
    floorNumber: checkNumber(room.floorNumber, { integer: true }),
    roomNumber: room.roomNumber.trim() ? undefined : "Room number is required",
    monthlyPrice: checkNumber(room.monthlyPrice, {
      required: true,
      label: "Monthly price",
    }),
    bookingFee: checkNumber(room.bookingFee),
    width: checkNumber(room.width, { min: 0.1 }),
    length: checkNumber(room.length, { min: 0.1 }),
    peoplePerRoom: checkNumber(room.peoplePerRoom, { integer: true, min: 1 }),
  }
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message)
  ) as RoomErrors
}

export function validateListing(draft: ListingDraft): ListingErrors {
  const errors: ListingErrors = {}

  if (!draft.houseName.trim()) errors.houseName = "House name is required"
  if (!draft.location.trim()) errors.location = "Location is required"

  const waterError = checkNumber(draft.waterPrice)
  if (waterError) errors.waterPrice = waterError
  const electricityError = checkNumber(draft.electricityPrice)
  if (electricityError) errors.electricityPrice = electricityError

  // The first photo is the cover on the customer listing.
  if (draft.images.length === 0) errors.images = "Add at least one photo"

  const roomErrors: Record<string, RoomErrors> = {}
  const seen = new Set<string>()
  for (const room of draft.rooms) {
    const errorsForRoom = validateRoom(room)
    const id = `${floorOf(room)}/${room.roomNumber.trim()}`
    if (!errorsForRoom.roomNumber && seen.has(id)) {
      errorsForRoom.roomNumber = "Another room on this floor has this number"
    }
    seen.add(id)
    if (Object.keys(errorsForRoom).length > 0) {
      roomErrors[room.key] = errorsForRoom
    }
  }
  if (Object.keys(roomErrors).length > 0) errors.rooms = roomErrors

  return errors
}

export function hasErrors(errors: ListingErrors): boolean {
  return Object.keys(errors).length > 0
}
