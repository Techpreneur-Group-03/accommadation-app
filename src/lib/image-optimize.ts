// Photos are resized and re-encoded in the browser before upload, so phone
// photos (often 4000px and 5+ MB) become ~200-400 KB files.
const MAX_DIMENSION = 1600
const QUALITY = 0.8
const MAX_SOURCE_BYTES = 25 * 1024 * 1024

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, QUALITY)
  )
}

// Returns a WebP image no larger than MAX_DIMENSION on its longest side.
// Falls back to JPEG in browsers that can't encode WebP.
export async function optimizeImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`${file.name} is not an image`)
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(`${file.name} is larger than 25 MB`)
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  } catch {
    throw new Error(`Couldn't read ${file.name}. Use a JPG, PNG or WebP photo.`)
  }

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
  )
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)

  const context = canvas.getContext("2d")
  if (!context) {
    bitmap.close()
    throw new Error("Your browser can't process images")
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  const webp = await canvasToBlob(canvas, "image/webp")
  if (webp?.type === "image/webp") return webp

  const jpeg = await canvasToBlob(canvas, "image/jpeg")
  if (!jpeg) throw new Error(`Couldn't process ${file.name}`)
  return jpeg
}
