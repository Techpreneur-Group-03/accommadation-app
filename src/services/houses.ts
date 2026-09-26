import type { House } from "@/data/sample-data"
import { supabase } from "@/lib/supabase"

interface HouseRow {
  house_id: number
  house_name: string
  owner_name: string
  location: string
  number_of_room: number
  people_per_room: number
  price_per_room: number
  rate: number
  phone_number: string
}

function toHouse(row: HouseRow): House {
  return {
    houseId: row.house_id,
    houseName: row.house_name,
    ownerName: row.owner_name,
    location: row.location,
    numberOfRoom: row.number_of_room,
    peoplePerRoom: row.people_per_room,
    pricePerRoom: row.price_per_room,
    rate: row.rate,
    phoneNumber: row.phone_number,
  }
}

export async function fetchHouses(): Promise<House[]> {
  const { data, error } = await supabase
    .from("houses")
    .select(
      "house_id, house_name, owner_name, location, number_of_room, people_per_room, price_per_room, rate, phone_number",
    )
    .order("house_id", { ascending: true })
    console.log("Fetched houses:", data) // Log the fetched data for debugging
  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(toHouse)
}