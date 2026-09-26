import { useState, type ReactNode } from "react"
import { Droplets, ImageOff, Zap, type LucideIcon } from "lucide-react"

import { cn, formatPrice } from "@/lib/utils"
import type { ListingImage, OwnerHouse } from "@/services/listings"

// Building blocks shared by the owner and customer listing detail pages.

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <h3
      className={cn(
        "text-sm font-semibold tracking-wide text-brand-dark uppercase",
        className
      )}
    >
      {children}
    </h3>
  )
}

export function InfoRow({
  icon: Icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: ReactNode
  label: string
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="mt-1 size-5 shrink-0 text-brand-dark/70" />
      <div>
        <p className="font-semibold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

const PHOTOS_PER_PAGE = 3

// One large photo and two smaller ones; dots page through the rest.
// Give it a `key` per room so it starts on the first page for each room.
export function RoomPhotos({
  images,
  roomLabel,
}: {
  images: ListingImage[]
  roomLabel: string
}) {
  const [page, setPage] = useState(0)

  if (images.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-2xl bg-muted text-sm text-muted-foreground">
        <ImageOff className="size-8" />
        No photos for this room yet
      </div>
    )
  }

  const pageCount = Math.ceil(images.length / PHOTOS_PER_PAGE)
  const start = page * PHOTOS_PER_PAGE
  const [main, ...rest] = images.slice(start, start + PHOTOS_PER_PAGE)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-4">
        <img
          src={main.url}
          alt={`${roomLabel} photo ${start + 1}`}
          className={cn(
            "w-full rounded-2xl object-cover",
            rest.length > 0
              ? "col-span-2 aspect-video"
              : "col-span-2 aspect-4/3"
          )}
        />
        {rest.map((image, index) => (
          <img
            key={image.id}
            src={image.url}
            alt={`${roomLabel} photo ${start + index + 2}`}
            className={cn(
              "aspect-4/3 w-full rounded-2xl object-cover",
              rest.length === 1 && "col-span-2"
            )}
          />
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show photos ${index * PHOTOS_PER_PAGE + 1} to ${Math.min(
                (index + 1) * PHOTOS_PER_PAGE,
                images.length
              )}`}
              aria-current={index === page}
              onClick={() => setPage(index)}
              className={cn(
                "size-2 rounded-full transition-all",
                index === page
                  ? "w-5 bg-brand"
                  : "bg-brand-dark/25 hover:bg-brand-dark/40"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function AdditionalInformation({ house }: { house: OwnerHouse }) {
  return (
    <section className="flex flex-col gap-5 rounded-2xl border-2 border-brand/40 p-6">
      <h3 className="font-heading font-semibold tracking-wide text-brand uppercase">
        Additional Information
      </h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <InfoRow
          icon={Droplets}
          value={
            house.waterPrice === null
              ? "Not set"
              : formatPrice(house.waterPrice)
          }
          label="water per cubic meter"
        />
        <InfoRow
          icon={Zap}
          value={
            house.electricityPrice === null
              ? "Not set"
              : formatPrice(house.electricityPrice)
          }
          label="electricity per kilowatt-hour"
        />
      </div>
      <div>
        <h4 className="font-heading font-semibold text-brand">Description</h4>
        <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {house.description || "No description yet."}
        </p>
      </div>
    </section>
  )
}
