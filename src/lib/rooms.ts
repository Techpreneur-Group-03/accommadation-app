import { FALLBACK_HOUSE_IMAGE } from "@/lib/house-images"
import type { House, Room } from "@/types/house-type"

const BED_TYPES = [
  "Single bed",
  "Double bed",
  "Queen bed",
  "Bunk bed",
  "Twin beds",
] as const

const FLOOR_LABELS = [
  "Ground floor",
  "1st floor",
  "2nd floor",
  "3rd floor",
] as const

const AMENITY_POOL = [
  "Wi-Fi",
  "Air conditioning",
  "Private bathroom",
  "Shared bathroom",
  "Furnished",
  "Balcony",
  "Natural light",
  "Study desk",
  "Wardrobe",
  "Laundry access",
  "Parking",
  "Pet friendly",
] as const

const ROOM_IMAGE_IDS = [
  "1505693416388-ac5ce068fe85",
  "1522771739844-6a9f6d5f14af",
  "1507089947368-19c1da9775ae",
  "1540518614846-7eded433c457",
  "1616486338812-3dadae4b4ace",
  "1560185007-cde436f6a4d0",
  "1595526114035-0d45ed16cfbf",
  "1616594039964-ae9021a400a0",
] as const

// Deterministic 32-bit hash so a given house always renders identical rooms.
function hashSeed(input: string) {
  let hash = 2166136261

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function createRandom(seed: number) {
  let state = hashSeed(String(seed)) || 1

  return () => {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    state >>>= 0
    return state / 4294967296
  }
}

function pick<T>(items: readonly T[], random: () => number) {
  return items[Math.floor(random() * items.length)]
}

function pickMany<T>(items: readonly T[], count: number, random: () => number) {
  const pool = [...items]
  const picked: T[] = []

  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(random() * pool.length)
    picked.push(...pool.splice(index, 1))
  }

  return picked
}

function buildDescription(
  floor: number,
  bedType: string,
  sizeSqm: number,
  amenities: string[]
) {
  const facing = sizeSqm >= 16 ? "a wide open view" : "a quiet courtyard view"

  return `${FLOOR_LABELS[floor]} corner room with ${bedType.toLowerCase()}, ${facing} and ${sizeSqm} m² of usable space. Comes ${amenities.slice(0, 2).join(" and ").toLowerCase()}, and is cleaned every week.`
}

function buildRoomImage(houseId: number, roomNumber: number) {
  const index = (houseId * 3 + roomNumber) % ROOM_IMAGE_IDS.length

  return `https://images.unsplash.com/photo-${ROOM_IMAGE_IDS[index]}?auto=format&fit=crop&w=900&q=80`
}

export function generateRooms(house: House): Room[] {
  const roomCount = Math.max(1, Math.floor(house.numberOfRoom) || 1)
  const random = createRandom(house.houseId)
  const floorCount = Math.max(1, Math.ceil(roomCount / 4))

  return Array.from({ length: roomCount }, (_, index) => {
    const roomNumber = index + 1
    const floor = index % floorCount
    const isAvailable = random() > 0.25
    const bedType = pick(BED_TYPES, random)
    const sizeSqm = 12 + Math.floor(random() * 12)
    const amenities = pickMany(
      AMENITY_POOL,
      3 + Math.floor(random() * 3),
      random
    )
    const capacity = Math.max(1, house.peoplePerRoom + (random() > 0.7 ? 1 : 0))
    const price = Math.round(house.pricePerRoom * (0.92 + random() * 0.24))

    return {
      roomId: `${house.houseId}-${roomNumber}`,
      houseId: house.houseId,
      roomNumber,
      floor,
      sizeSqm,
      price,
      capacity,
      bedType,
      isAvailable,
      availableFrom: isAvailable
        ? "Available now"
        : `Free from ${1 + Math.floor(random() * 28)} ${random() > 0.5 ? "Oct" : "Nov"} 2026`,
      amenities,
      description: buildDescription(floor, bedType, sizeSqm, amenities),
      image: buildRoomImage(house.houseId, roomNumber),
    }
  })
}

export const FALLBACK_ROOM_IMAGE = FALLBACK_HOUSE_IMAGE
