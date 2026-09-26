const UNSPLASH_ORIGIN = "https://images.unsplash.com/photo-"

const UNSPLASH_PARAMS = "?auto=format&fit=crop&w=900&q=80"

// Curated photo ids, each verified to return 200. Order is mirrored in
// supabase/house_image.sql so a given house_id always maps to the same photo.
const HOUSE_IMAGE_IDS = [
  "1512917774080-9991f1c4c750",
  "1560448204-e02f11c3d0e2",
  "1568605114967-8130f3a36994",
  "1570129477492-45c003edd2be",
  "1580587771525-78b9dba3b914",
  "1600585154340-be6161a56a0c",
  "1600596542815-ffad4c1539a9",
  "1600607687939-ce8a6c25118c",
  "1493809842364-78817add7ffb",
  "1522708323590-d24dbb6b0267",
  "1449844908441-8829872d2607",
  "1583608205776-bfd35f0d9f83",
  "1512915922686-57c11dde9b6b",
  "1554995207-c18c203602cb",
  "1484154218962-a197022b5858",
  "1605276374104-dee2a0ed3cd6",
  "1586023492125-27b2c045efd7",
  "1502005229762-cf1b2da7c5d6",
] as const

function buildUrl(photoId: string) {
  return `${UNSPLASH_ORIGIN}${photoId}${UNSPLASH_PARAMS}`
}

export function houseImageFor(houseId: number) {
  const index = Math.abs(houseId) % HOUSE_IMAGE_IDS.length
  return buildUrl(HOUSE_IMAGE_IDS[index])
}

export const FALLBACK_HOUSE_IMAGE = buildUrl(HOUSE_IMAGE_IDS[0])
