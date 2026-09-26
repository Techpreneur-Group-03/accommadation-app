import { useAuth } from "@/components/auth-provider"
import { useAsyncData } from "@/hooks/use-async-data"
import { fetchOwnerHouse, fetchOwnerHouses } from "@/services/listings"

// The signed-in owner's houses, newest edits first.
export function useOwnerHouses() {
  const { user } = useAuth()
  const userId = user?.id ?? null

  return useAsyncData(userId && `owner-houses:${userId}`, () =>
    userId ? fetchOwnerHouses(userId) : Promise.resolve([])
  )
}

// One of the signed-in owner's houses; data is null when it doesn't exist or
// belongs to someone else. Pass null to skip loading (e.g. a create form).
export function useOwnerHouse(houseId: number | null) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const key =
    userId && houseId !== null ? `owner-house:${userId}:${houseId}` : null

  return useAsyncData(key, () =>
    userId && houseId !== null && Number.isInteger(houseId)
      ? fetchOwnerHouse(userId, houseId)
      : Promise.resolve(null)
  )
}
