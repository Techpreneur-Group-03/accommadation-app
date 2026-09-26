import type { House } from "@/types/house-type"

import { houseImageFor } from "@/lib/house-images"
import { supabase } from "@/lib/supabase"
import { imageUrl } from "@/services/listings"

// A row of the house_listings view: published houses with at least one
// available room, from every owner.
interface HouseListingRow {
  id: number
  house_name: string
  location: string
  owner_name: string | null
  phone_number: string | null
  available_rooms: number
  price_from: number
  max_people_per_room: number
  cover_image_path: string | null
}

const HOUSE_LISTING_COLUMNS =
  "id, house_name, location, owner_name, phone_number, available_rooms, price_from, max_people_per_room, cover_image_path"

function toHouse(row: HouseListingRow): House {
  return {
    houseId: row.id,
    houseName: row.house_name,
    ownerName: row.owner_name ?? "Unknown",
    location: row.location,
    numberOfRoom: row.available_rooms,
    peoplePerRoom: row.max_people_per_room,
    pricePerRoom: row.price_from,
    phoneNumber: row.phone_number ?? "",
    // Owner-uploaded cover photo, else a stock photo picked by id.
    houseImage: row.cover_image_path
      ? imageUrl(row.cover_image_path)
      : houseImageFor(row.id),
  }
}

export async function fetchHouses(): Promise<House[]> {
  const { data, error } = await supabase
    .from("house_listings")
    .select(HOUSE_LISTING_COLUMNS)
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(toHouse)
}

export async function fetchHouseById(houseId: number): Promise<House | null> {
  const { data, error } = await supabase
    .from("house_listings")
    .select(HOUSE_LISTING_COLUMNS)
    .eq("id", houseId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data ? toHouse(data) : null
}
