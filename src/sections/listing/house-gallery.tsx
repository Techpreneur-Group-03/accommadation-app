import { useEffect, useState } from "react"
import { ImageOff } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { ListingImage } from "@/services/listings"

// House photos with the selected one centered and its neighbours smaller
// (design: listing detail header gallery).
export function HouseGallery({
  images,
  houseName,
}: {
  images: ListingImage[]
  houseName: string
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!api) return
    const onSelect = () => setSelected(api.selectedScrollSnap())
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api])

  if (images.length === 0) {
    return (
      <div className="flex aspect-21/9 items-center justify-center rounded-2xl bg-muted">
        <ImageOff className="size-10 text-muted-foreground" />
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <img
        src={images[0].url}
        alt={houseName}
        className="mx-auto aspect-video max-h-96 w-full rounded-2xl object-cover"
      />
    )
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{ align: "center", loop: images.length > 2 }}
      className="px-0 sm:px-12"
    >
      <CarouselContent className="items-center py-4">
        {images.map((image, index) => (
          <CarouselItem key={image.id} className="basis-4/5 sm:basis-3/5">
            <img
              src={image.url}
              alt={`${houseName} photo ${index + 1}`}
              className={cn(
                "aspect-video w-full rounded-2xl object-cover transition-all duration-300",
                index === selected
                  ? "scale-100 shadow-[0_12px_32px_rgba(15,23,42,0.25)]"
                  : "scale-85 opacity-70"
              )}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0 hidden sm:flex" />
      <CarouselNext className="right-0 hidden sm:flex" />
    </Carousel>
  )
}

export default HouseGallery
