export interface House {
  houseId: number
  houseName: string
  ownerName: string
  location: string
  numberOfRoom: number
  peoplePerRoom: number
  pricePerRoom: number
  // Hidden for now; listings from Supabase don't include it.
  rate?: number
  phoneNumber: string
  houseImage: string
}

export interface Room {
  roomId: string
  houseId: number
  roomNumber: number
  floor: number
  sizeSqm: number
  price: number
  capacity: number
  bedType: string
  isAvailable: boolean
  availableFrom: string
  amenities: string[]
  description: string
  image: string
}
