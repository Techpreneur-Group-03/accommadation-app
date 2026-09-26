import {
  floorOf,
  parseNumber,
  type ImageEntry,
  type ListingDraft,
  type RoomDraft,
} from "@/lib/listing-form"
import { supabase } from "@/lib/supabase"

const BUCKET = "house-images"

export interface Room {
  id: number
  floorNumber: number
  roomNumber: string
  monthlyPrice: number
  bookingFee: number
  widthM: number | null
  lengthM: number | null
  peoplePerRoom: number
  isAvailable: boolean
}

export interface ListingImage {
  id: number
  // null for photos of the house, set for photos of one room.
  roomId: number | null
  storagePath: string
  position: number
  url: string
}

export interface OwnerHouse {
  id: number
  houseName: string
  location: string
  description: string | null
  waterPrice: number | null
  electricityPrice: number | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
  // Sorted by floor, then room number.
  rooms: Room[]
  // Sorted by position; the first house photo is the cover.
  images: ListingImage[]
}

interface RoomRow {
  id: number
  floor_number: number
  room_number: string
  monthly_price: number
  booking_fee: number
  width_m: number | null
  length_m: number | null
  people_per_room: number
  is_available: boolean
}

interface ImageRow {
  id: number
  room_id: number | null
  storage_path: string
  position: number
}

interface HouseRow {
  id: number
  house_name: string
  location: string
  description: string | null
  water_price: number | null
  electricity_price: number | null
  is_published: boolean
  created_at: string
  updated_at: string
  rooms: RoomRow[]
  house_images: ImageRow[]
}

// house_images links houses and rooms, so PostgREST needs the foreign key
// named to embed each one directly.
const HOUSE_SELECT = `
  id, house_name, location, description, water_price, electricity_price,
  is_published, created_at, updated_at,
  rooms!rooms_house_id_fkey (
    id, floor_number, room_number, monthly_price, booking_fee,
    width_m, length_m, people_per_room, is_available
  ),
  house_images!house_images_house_id_fkey (id, room_id, storage_path, position)
`

export function imageUrl(storagePath: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}

const roomNumberCollator = new Intl.Collator(undefined, { numeric: true })

function toOwnerHouse(row: HouseRow): OwnerHouse {
  const rooms = row.rooms
    .map((room): Room => ({
      id: room.id,
      floorNumber: room.floor_number,
      roomNumber: room.room_number,
      monthlyPrice: room.monthly_price,
      bookingFee: room.booking_fee,
      widthM: room.width_m,
      lengthM: room.length_m,
      peoplePerRoom: room.people_per_room,
      isAvailable: room.is_available,
    }))
    .sort(
      (a, b) =>
        a.floorNumber - b.floorNumber ||
        roomNumberCollator.compare(a.roomNumber, b.roomNumber)
    )

  const images = row.house_images
    .map((image): ListingImage => ({
      id: image.id,
      roomId: image.room_id,
      storagePath: image.storage_path,
      position: image.position,
      url: imageUrl(image.storage_path),
    }))
    .sort((a, b) => a.position - b.position || a.id - b.id)

  return {
    id: row.id,
    houseName: row.house_name,
    location: row.location,
    description: row.description,
    waterPrice: row.water_price,
    electricityPrice: row.electricity_price,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    rooms,
    images,
  }
}

// --- Derived values used across the owner portal ---------------------------

export const availableRooms = (house: OwnerHouse) =>
  house.rooms.filter((room) => room.isAvailable)

export const houseImages = (house: OwnerHouse) =>
  house.images.filter((image) => image.roomId === null)

export const roomImages = (house: OwnerHouse, roomId: number) =>
  house.images.filter((image) => image.roomId === roomId)

export const coverImage = (house: OwnerHouse) => houseImages(house)[0] ?? null

// Lowest monthly price among available rooms (all rooms when none are free).
export function priceFrom(house: OwnerHouse): number | null {
  const rooms = availableRooms(house)
  const prices = (rooms.length > 0 ? rooms : house.rooms).map(
    (room) => room.monthlyPrice
  )
  return prices.length > 0 ? Math.min(...prices) : null
}

// --- Reads -------------------------------------------------------------------

export async function fetchOwnerHouses(ownerId: string): Promise<OwnerHouse[]> {
  const { data, error } = await supabase
    .from("houses")
    .select(HOUSE_SELECT)
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false })

  if (error) throw new Error(error.message)
  return (data as unknown as HouseRow[]).map(toOwnerHouse)
}

export async function fetchOwnerHouse(
  ownerId: string,
  houseId: number
): Promise<OwnerHouse | null> {
  const { data, error } = await supabase
    .from("houses")
    .select(HOUSE_SELECT)
    .eq("owner_id", ownerId)
    .eq("id", houseId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data ? toOwnerHouse(data as unknown as HouseRow) : null
}

export interface PublicListing {
  house: OwnerHouse
  ownerName: string
  ownerPhone: string | null
}

// A listing as customers see it. Returns null when the house isn't shown to
// customers (hidden, deleted, or every room occupied).
export async function fetchPublicListing(
  houseId: number
): Promise<PublicListing | null> {
  // Owner name and phone come from the house_listings view because profiles
  // are private; the view also decides whether the listing is visible.
  const [listing, house] = await Promise.all([
    supabase
      .from("house_listings")
      .select("owner_name, phone_number")
      .eq("id", houseId)
      .maybeSingle(),
    supabase
      .from("houses")
      .select(HOUSE_SELECT)
      .eq("id", houseId)
      .maybeSingle(),
  ])

  if (listing.error) throw new Error(listing.error.message)
  if (house.error) throw new Error(house.error.message)
  if (!listing.data || !house.data) return null

  return {
    house: toOwnerHouse(house.data as unknown as HouseRow),
    ownerName: listing.data.owner_name ?? "Unknown",
    ownerPhone: listing.data.phone_number,
  }
}

// --- Writes ------------------------------------------------------------------

function houseValues(draft: ListingDraft) {
  return {
    house_name: draft.houseName.trim(),
    location: draft.location.trim(),
    description: draft.description.trim() || null,
    water_price: parseNumber(draft.waterPrice),
    electricity_price: parseNumber(draft.electricityPrice),
    is_published: draft.isPublished,
  }
}

function roomValues(houseId: number, room: RoomDraft) {
  return {
    house_id: houseId,
    floor_number: floorOf(room),
    room_number: room.roomNumber.trim(),
    monthly_price: parseNumber(room.monthlyPrice) ?? 0,
    booking_fee: parseNumber(room.bookingFee) ?? 0,
    width_m: parseNumber(room.width),
    length_m: parseNumber(room.length),
    people_per_room: parseNumber(room.peoplePerRoom) ?? 1,
    is_available: room.isAvailable,
  }
}

async function uploadImage(
  ownerId: string,
  houseId: number,
  blob: Blob
): Promise<string> {
  const extension = blob.type === "image/webp" ? "webp" : "jpg"
  // Owners can only write to their own folder (storage policy).
  const path = `${ownerId}/${houseId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
  })

  if (error) throw new Error(`Photo upload failed: ${error.message}`)
  return path
}

async function removeFiles(paths: string[]) {
  if (paths.length === 0) return
  const { error } = await supabase.storage.from(BUCKET).remove(paths)
  // The listing is already saved; a leftover file only wastes storage.
  if (error) console.error("Failed to remove photos from storage:", error)
}

interface ImageSlot {
  entry: ImageEntry
  roomId: number | null
  position: number
}

// Uploads new photos and writes house_images rows so the database matches
// the form: new rows for new photos, updated positions for kept ones.
// Paths of uploaded files are pushed to `uploaded` so callers can clean up.
async function saveImages(
  ownerId: string,
  houseId: number,
  slots: ImageSlot[],
  uploaded: string[]
) {
  const newRows = []
  for (const { entry, roomId, position } of slots) {
    if (entry.kind !== "new") continue
    const path = await uploadImage(ownerId, houseId, entry.blob)
    uploaded.push(path)
    newRows.push({
      house_id: houseId,
      room_id: roomId,
      storage_path: path,
      position,
    })
  }

  if (newRows.length > 0) {
    const { error } = await supabase.from("house_images").insert(newRows)
    if (error) throw new Error(error.message)
  }

  for (const { entry, position } of slots) {
    if (entry.kind !== "existing") continue
    const { error } = await supabase
      .from("house_images")
      .update({ position })
      .eq("id", entry.id)
    if (error) throw new Error(error.message)
  }
}

function imageSlots(
  draft: ListingDraft,
  roomIdByKey: Map<string, number>
): ImageSlot[] {
  const slots: ImageSlot[] = draft.images.map((entry, position) => ({
    entry,
    roomId: null,
    position,
  }))
  for (const room of draft.rooms) {
    const roomId = roomIdByKey.get(room.key)
    if (roomId === undefined) throw new Error("Room was not saved")
    room.images.forEach((entry, position) =>
      slots.push({ entry, roomId, position })
    )
  }
  return slots
}

async function insertRooms(
  houseId: number,
  rooms: RoomDraft[],
  roomIdByKey: Map<string, number>
) {
  if (rooms.length === 0) return

  const { data, error } = await supabase
    .from("rooms")
    .insert(rooms.map((room) => roomValues(houseId, room)))
    .select("id, floor_number, room_number")
  if (error) throw new Error(error.message)

  // Floor + room number is unique per house, so it identifies each new row.
  for (const room of rooms) {
    const row = data.find(
      (saved) =>
        saved.floor_number === floorOf(room) &&
        saved.room_number === room.roomNumber.trim()
    )
    if (!row) throw new Error("Room was not saved")
    roomIdByKey.set(room.key, row.id)
  }
}

export async function createListing(
  ownerId: string,
  draft: ListingDraft
): Promise<number> {
  const { data: house, error } = await supabase
    .from("houses")
    .insert(houseValues(draft))
    .select("id")
    .single()
  if (error) throw new Error(error.message)

  const uploaded: string[] = []
  try {
    const roomIdByKey = new Map<string, number>()
    await insertRooms(house.id, draft.rooms, roomIdByKey)
    await saveImages(
      ownerId,
      house.id,
      imageSlots(draft, roomIdByKey),
      uploaded
    )
    return house.id
  } catch (err) {
    // Don't leave a half-created listing behind. Rooms and photo rows are
    // deleted with the house.
    await supabase.from("houses").delete().eq("id", house.id)
    await removeFiles(uploaded)
    throw err
  }
}

// Not atomic: if a step fails, earlier steps stay saved. Saving again from
// the form completes the update.
export async function updateListing(
  ownerId: string,
  house: OwnerHouse,
  draft: ListingDraft
): Promise<void> {
  const { error } = await supabase
    .from("houses")
    .update(houseValues(draft))
    .eq("id", house.id)
  if (error) throw new Error(error.message)

  // Photos removed in the form, including all photos of removed rooms.
  const keptImageIds = new Set(
    [draft.images, ...draft.rooms.map((room) => room.images)]
      .flat()
      .flatMap((entry) => (entry.kind === "existing" ? [entry.id] : []))
  )
  const removedImages = house.images.filter(
    (image) => !keptImageIds.has(image.id)
  )
  if (removedImages.length > 0) {
    const { error } = await supabase
      .from("house_images")
      .delete()
      .in(
        "id",
        removedImages.map((image) => image.id)
      )
    if (error) throw new Error(error.message)
  }

  const keptRoomIds = new Set(draft.rooms.flatMap((room) => room.id ?? []))
  const removedRoomIds = house.rooms
    .filter((room) => !keptRoomIds.has(room.id))
    .map((room) => room.id)
  if (removedRoomIds.length > 0) {
    const { error } = await supabase
      .from("rooms")
      .delete()
      .in("id", removedRoomIds)
    if (error) throw new Error(error.message)
  }

  const roomIdByKey = new Map<string, number>()
  for (const room of draft.rooms) {
    if (room.id === undefined) continue
    const { error } = await supabase
      .from("rooms")
      .update(roomValues(house.id, room))
      .eq("id", room.id)
    if (error) throw new Error(error.message)
    roomIdByKey.set(room.key, room.id)
  }
  await insertRooms(
    house.id,
    draft.rooms.filter((room) => room.id === undefined),
    roomIdByKey
  )

  const uploaded: string[] = []
  try {
    await saveImages(
      ownerId,
      house.id,
      imageSlots(draft, roomIdByKey),
      uploaded
    )
  } catch (err) {
    await removeFiles(uploaded)
    throw err
  }

  await removeFiles(removedImages.map((image) => image.storagePath))
}

export async function deleteListing(house: OwnerHouse): Promise<void> {
  const { error } = await supabase.from("houses").delete().eq("id", house.id)
  if (error) throw new Error(error.message)

  // Rooms and photo rows are deleted with the house; the files are not.
  await removeFiles(house.images.map((image) => image.storagePath))
}

export async function setListingPublished(
  houseId: number,
  isPublished: boolean
): Promise<void> {
  const { error } = await supabase
    .from("houses")
    .update({ is_published: isPublished })
    .eq("id", houseId)
  if (error) throw new Error(error.message)
}

export async function setRoomAvailable(
  roomId: number,
  isAvailable: boolean
): Promise<void> {
  const { error } = await supabase
    .from("rooms")
    .update({ is_available: isAvailable })
    .eq("id", roomId)
  if (error) throw new Error(error.message)
}
