import type { House } from "@/types/house-type"

// Values are kept as strings so number inputs can be empty.
export interface SearchFilters {
  query: string
  location: string
  peoplePerRoom: string
  minPrice: string
}

export const emptySearchFilters: SearchFilters = {
  query: "",
  location: "",
  peoplePerRoom: "",
  minPrice: "",
}

function includesText(value: string, search: string) {
  return value.toLowerCase().includes(search.trim().toLowerCase())
}

function toNumber(value: string) {
  const number = Number(value)
  return value.trim() === "" || Number.isNaN(number) ? null : number
}

export function filterHouses(houses: House[], filters: SearchFilters) {
  const peoplePerRoom = toNumber(filters.peoplePerRoom)
  const minPrice = toNumber(filters.minPrice)

  return houses.filter(
    (house) =>
      (includesText(house.houseName, filters.query) ||
        includesText(house.ownerName, filters.query)) &&
      includesText(house.location, filters.location) &&
      (peoplePerRoom === null || house.peoplePerRoom >= peoplePerRoom) &&
      (minPrice === null || house.pricePerRoom >= minPrice)
  )
}
