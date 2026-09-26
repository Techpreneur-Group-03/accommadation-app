import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import {
  Building2,
  Droplets,
  House,
  LoaderCircle,
  MapPin,
  Plus,
  Zap,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"

import { useAuth } from "@/components/auth-provider"
import {
  brandActionClassName,
  brandSwitchClassName,
  fieldClassName,
} from "@/components/field-styles"
import { FormAlert, FormField, IconInput } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useOwnerHouse } from "@/hooks/use-owner-houses"
import {
  draftFromHouse,
  draftPreviewUrls,
  emptyListingDraft,
  hasErrors,
  newRoomDraft,
  validateListing,
  type ListingDraft,
  type ListingErrors,
  type RoomDraft,
} from "@/lib/listing-form"
import { cn } from "@/lib/utils"
import { ImagePicker } from "@/sections/owner/image-picker"
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OwnerPanel,
  PanelHeader,
} from "@/sections/owner/owner-panel"
import { RoomFields } from "@/sections/owner/room-fields"
import {
  createListing,
  updateListing,
  type OwnerHouse,
} from "@/services/listings"

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="border-b pb-3">
        <h3 className="text-sm font-semibold tracking-wide text-brand-dark uppercase">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}

const numberInputProps = {
  type: "number",
  inputMode: "decimal",
  min: 0,
  step: "any",
} as const

interface ListingFormProps {
  // Existing listing when editing; undefined when creating.
  house?: OwnerHouse
}

function ListingForm({ house }: ListingFormProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [draft, setDraft] = useState<ListingDraft>(() =>
    house ? draftFromHouse(house) : emptyListingDraft()
  )
  const [errors, setErrors] = useState<ListingErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Release photo previews when leaving the form.
  const draftRef = useRef(draft)
  useEffect(() => {
    draftRef.current = draft
  }, [draft])
  useEffect(
    () => () => draftPreviewUrls(draftRef.current).forEach(URL.revokeObjectURL),
    []
  )

  const setField =
    (
      field:
        | "houseName"
        | "location"
        | "description"
        | "waterPrice"
        | "electricityPrice"
    ) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target
      setDraft((current) => ({ ...current, [field]: value }))
      setErrors((current) => ({ ...current, [field]: undefined }))
    }

  const updateRoom =
    (key: string) => (update: (room: RoomDraft) => RoomDraft) => {
      setDraft((current) => ({
        ...current,
        rooms: current.rooms.map((room) =>
          room.key === key ? update(room) : room
        ),
      }))
      // Editing a room clears its errors until the next save attempt.
      setErrors((current) => {
        if (!current.rooms?.[key]) return current
        const rooms = { ...current.rooms }
        delete rooms[key]
        return { ...current, rooms }
      })
    }

  const addRoom = () =>
    setDraft((current) => ({
      ...current,
      rooms: [
        ...current.rooms,
        newRoomDraft(current.rooms.at(-1)?.floorNumber || "1"),
      ],
    }))

  const removeRoom = (room: RoomDraft) => {
    room.images.forEach((image) => {
      if (image.kind === "new") URL.revokeObjectURL(image.previewUrl)
    })
    setDraft((current) => ({
      ...current,
      rooms: current.rooms.filter((item) => item.key !== room.key),
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    const nextErrors = validateListing(draft)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) {
      toast.error("Please fix the highlighted fields")
      // Wait for the error styles to render, then jump to the first one.
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>("[data-field-error]")
          ?.scrollIntoView({ behavior: "smooth", block: "center" })
      })
      return
    }

    setIsSaving(true)
    setSaveError(null)
    try {
      if (house) {
        await updateListing(user.id, house, draft)
        toast.success("Listing updated")
        navigate(`/admin/listings/${house.id}`)
      } else {
        const houseId = await createListing(user.id, draft)
        toast.success("Listing created")
        navigate(`/admin/listings/${houseId}`)
      }
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save the listing"
      )
      setIsSaving(false)
    }
  }

  const backTo = house ? `/admin/listings/${house.id}` : "/admin/listings"

  return (
    <OwnerPanel>
      <PanelHeader
        backTo={backTo}
        title={house ? "Edit Listing" : "Add Listing"}
        description={
          house
            ? `Update the details, rooms and photos of ${house.houseName}.`
            : "Add your house so customers can find it."
        }
      />

      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-10"
      >
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField
              id="house-name"
              label="House Name"
              error={errors.houseName}
            >
              <IconInput
                id="house-name"
                icon={House}
                placeholder="e.g. Sopheap's Renthouse"
                error={errors.houseName}
                value={draft.houseName}
                onChange={setField("houseName")}
              />
            </FormField>
            <FormField id="location" label="Location" error={errors.location}>
              <IconInput
                id="location"
                icon={MapPin}
                placeholder="e.g. Khan Sen Sok, Phnom Penh"
                error={errors.location}
                value={draft.location}
                onChange={setField("location")}
              />
            </FormField>
            <FormField
              id="description"
              label="Description"
              className="md:col-span-2"
            >
              <Textarea
                id="description"
                rows={5}
                placeholder="Describe the house, the area and what's included in the rent."
                value={draft.description}
                onChange={setField("description")}
                className={cn(
                  fieldClassName,
                  "h-auto min-h-28 px-3.5 py-3 placeholder:text-muted-foreground/70"
                )}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection
          title="House Photos"
          description="The first photo is the cover customers see. Photos are resized and compressed before upload."
        >
          <ImagePicker
            label="House photo"
            withCover
            images={draft.images}
            error={errors.images}
            onChange={(update) => {
              setDraft((current) => ({
                ...current,
                images: update(current.images),
              }))
              setErrors((current) => ({ ...current, images: undefined }))
            }}
          />
        </FormSection>

        <FormSection
          title="Rooms"
          description="Floor and room number start at 1, so a small house can stay a single room. Add more rooms for bigger buildings."
        >
          <div className="flex flex-col gap-4">
            {draft.rooms.map((room, index) => (
              <RoomFields
                key={room.key}
                room={room}
                index={index}
                errors={errors.rooms?.[room.key]}
                canRemove={draft.rooms.length > 1}
                onChange={updateRoom(room.key)}
                onRemove={() => removeRoom(room)}
              />
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={addRoom}
            className="w-fit border-brand text-brand hover:bg-brand/10 hover:text-brand"
          >
            <Plus />
            Add room
          </Button>
        </FormSection>

        <FormSection title="Additional Information">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <FormField
              id="water-price"
              label="Water Price ($ per m³)"
              error={errors.waterPrice}
            >
              <IconInput
                id="water-price"
                icon={Droplets}
                {...numberInputProps}
                placeholder="e.g. 0.75"
                error={errors.waterPrice}
                value={draft.waterPrice}
                onChange={setField("waterPrice")}
              />
            </FormField>
            <FormField
              id="electricity-price"
              label="Electricity Price ($ per kWh)"
              error={errors.electricityPrice}
            >
              <IconInput
                id="electricity-price"
                icon={Zap}
                {...numberInputProps}
                placeholder="e.g. 0.25"
                error={errors.electricityPrice}
                value={draft.electricityPrice}
                onChange={setField("electricityPrice")}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Visibility">
          <div className="flex items-start gap-3">
            <Switch
              id="is-published"
              checked={draft.isPublished}
              onCheckedChange={(checked) =>
                setDraft((current) => ({ ...current, isPublished: checked }))
              }
              className={cn(brandSwitchClassName, "mt-0.5")}
            />
            <div>
              <Label htmlFor="is-published" className="font-semibold">
                Show this listing to customers
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">
                Customers only see it while at least one room is available.
              </p>
            </div>
          </div>
        </FormSection>

        {saveError && <FormAlert>{saveError}</FormAlert>}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            render={<Link to={backTo} />}
            nativeButton={false}
            className="h-9"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className={brandActionClassName}
          >
            {isSaving && <LoaderCircle className="animate-spin" />}
            {isSaving ? "Saving..." : house ? "Save changes" : "Create listing"}
          </Button>
        </div>
      </form>
    </OwnerPanel>
  )
}

// /admin/listings/new and /admin/listings/:id/edit
export function ListingFormPage() {
  const { id } = useParams()
  const houseId = id === undefined ? null : Number(id)
  const { data: house, error, isLoading, reload } = useOwnerHouse(houseId)

  if (houseId === null) return <ListingForm />

  if (isLoading) {
    return (
      <OwnerPanel>
        <LoadingState label="Loading listing..." />
      </OwnerPanel>
    )
  }
  if (error) {
    return (
      <OwnerPanel>
        <ErrorState message={error} onRetry={reload} />
      </OwnerPanel>
    )
  }
  if (!house) {
    return (
      <OwnerPanel>
        <EmptyState
          icon={Building2}
          title="Listing not found"
          description="It may have been deleted, or it belongs to another owner."
          action={
            <Button
              variant="outline"
              render={<Link to="/admin/listings" />}
              nativeButton={false}
            >
              Back to My Listings
            </Button>
          }
        />
      </OwnerPanel>
    )
  }

  // Keyed so the form starts fresh if a different listing is opened.
  return <ListingForm key={house.id} house={house} />
}

export default ListingFormPage
