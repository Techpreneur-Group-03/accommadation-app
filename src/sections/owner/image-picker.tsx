import { useId, useState, type ChangeEvent } from "react"
import { ImagePlus, LoaderCircle, Star, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { optimizeImage } from "@/lib/image-optimize"
import { newKey, type ImageEntry } from "@/lib/listing-form"
import { cn } from "@/lib/utils"

type ImagesUpdate = (update: (images: ImageEntry[]) => ImageEntry[]) => void

interface ImagePickerProps {
  images: ImageEntry[]
  // Takes an updater because photos finish optimizing asynchronously.
  onChange: ImagesUpdate
  label: string
  // Mark the first photo as the cover and allow choosing another one.
  withCover?: boolean
  error?: string
}

export function ImagePicker({
  images,
  onChange,
  label,
  withCover = false,
  error,
}: ImagePickerProps) {
  const inputId = useId()
  const [processingCount, setProcessingCount] = useState(0)
  const [processError, setProcessError] = useState<string | null>(null)

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    // Allow picking the same file again later.
    event.target.value = ""
    if (files.length === 0) return

    setProcessError(null)
    setProcessingCount((count) => count + files.length)
    const failures: string[] = []

    for (const file of files) {
      try {
        const blob = await optimizeImage(file)
        const entry: ImageEntry = {
          kind: "new",
          key: newKey(),
          blob,
          previewUrl: URL.createObjectURL(blob),
        }
        onChange((current) => [...current, entry])
      } catch (err: unknown) {
        failures.push(err instanceof Error ? err.message : file.name)
      } finally {
        setProcessingCount((count) => count - 1)
      }
    }

    if (failures.length > 0) setProcessError(failures.join(" "))
  }

  const remove = (key: string) => {
    const removed = images.find((image) => image.key === key)
    if (removed?.kind === "new") URL.revokeObjectURL(removed.previewUrl)
    onChange((current) => current.filter((image) => image.key !== key))
  }

  const makeCover = (key: string) =>
    onChange((current) => {
      const chosen = current.find((image) => image.key === key)
      return chosen
        ? [chosen, ...current.filter((image) => image.key !== key)]
        : current
    })

  const isProcessing = processingCount > 0
  const message = processError ?? error

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => {
          const isCover = withCover && index === 0
          return (
            <div
              key={image.key}
              className="group relative aspect-4/3 overflow-hidden rounded-xl bg-muted"
            >
              <img
                src={image.kind === "new" ? image.previewUrl : image.url}
                alt={`${label} ${index + 1}`}
                className="size-full object-cover"
              />
              {isCover && (
                <span className="absolute bottom-2 left-2 rounded-full bg-brand px-2 py-0.5 text-xs font-medium text-brand-foreground">
                  Cover
                </span>
              )}
              {withCover && !isCover && (
                <Button
                  type="button"
                  size="xs"
                  variant="secondary"
                  onClick={() => makeCover(image.key)}
                  className="absolute bottom-2 left-2 bg-white/90 opacity-100 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                >
                  <Star />
                  Make cover
                </Button>
              )}
              <Button
                type="button"
                size="icon-xs"
                variant="secondary"
                aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
                onClick={() => remove(image.key)}
                className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white"
              >
                <X />
              </Button>
            </div>
          )
        })}

        <label
          htmlFor={inputId}
          className={cn(
            "flex aspect-4/3 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-brand/40 text-sm text-brand transition-colors hover:bg-brand/5 has-focus-visible:ring-3 has-focus-visible:ring-brand/40",
            error && "border-destructive/60",
            isProcessing && "pointer-events-none opacity-70"
          )}
        >
          {isProcessing ? (
            <>
              <LoaderCircle className="size-6 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <ImagePlus className="size-6" />
              Add photos
            </>
          )}
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={isProcessing}
            className="sr-only"
            onChange={handleFiles}
          />
        </label>
      </div>
      {message && (
        <p data-field-error className="text-xs text-destructive">
          {message}
        </p>
      )}
    </div>
  )
}

export default ImagePicker
