import {
  DoorClosed,
  Layers,
  Receipt,
  Ruler,
  Trash2,
  UsersRound,
  Wallet,
} from "lucide-react"

import { brandSwitchClassName } from "@/components/field-styles"
import { FormField, IconInput } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { RoomDraft, RoomErrors } from "@/lib/listing-form"
import { ImagePicker } from "@/sections/owner/image-picker"

type RoomUpdate = (update: (room: RoomDraft) => RoomDraft) => void

interface RoomFieldsProps {
  room: RoomDraft
  index: number
  errors?: RoomErrors
  canRemove: boolean
  onChange: RoomUpdate
  onRemove: () => void
}

// Numeric text field; values stay strings so they can be empty.
const numberInputProps = {
  type: "number",
  inputMode: "decimal",
  min: 0,
  step: "any",
} as const

export function RoomFields({
  room,
  index,
  errors = {},
  canRemove,
  onChange,
  onRemove,
}: RoomFieldsProps) {
  const id = (field: string) => `room-${room.key}-${field}`
  const set =
    (field: keyof RoomDraft) => (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange((current) => ({ ...current, [field]: event.target.value }))

  return (
    <fieldset className="rounded-2xl border-2 border-brand/25 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <legend className="font-heading font-semibold text-brand-dark">
          Room {index + 1}
          {room.roomNumber.trim() && (
            <span className="font-normal text-muted-foreground">
              {" "}
              · No. {room.roomNumber.trim()}, floor {room.floorNumber || "1"}
            </span>
          )}
        </legend>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
            Remove room
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
        <FormField id={id("floor")} label="Floor" error={errors.floorNumber}>
          <IconInput
            id={id("floor")}
            icon={Layers}
            {...numberInputProps}
            inputMode="numeric"
            step={1}
            placeholder="1"
            error={errors.floorNumber}
            value={room.floorNumber}
            onChange={set("floorNumber")}
          />
        </FormField>
        <FormField
          id={id("number")}
          label="Room Number"
          error={errors.roomNumber}
        >
          <IconInput
            id={id("number")}
            icon={DoorClosed}
            placeholder="e.g. 101 or 8"
            error={errors.roomNumber}
            value={room.roomNumber}
            onChange={set("roomNumber")}
          />
        </FormField>
        <FormField
          id={id("price")}
          label="Monthly Payment ($)"
          error={errors.monthlyPrice}
        >
          <IconInput
            id={id("price")}
            icon={Wallet}
            {...numberInputProps}
            placeholder="e.g. 120"
            error={errors.monthlyPrice}
            value={room.monthlyPrice}
            onChange={set("monthlyPrice")}
          />
        </FormField>
        <FormField
          id={id("fee")}
          label="Booking Fee ($)"
          error={errors.bookingFee}
        >
          <IconInput
            id={id("fee")}
            icon={Receipt}
            {...numberInputProps}
            placeholder="0"
            error={errors.bookingFee}
            value={room.bookingFee}
            onChange={set("bookingFee")}
          />
        </FormField>
        <FormField id={id("width")} label="Width (m)" error={errors.width}>
          <IconInput
            id={id("width")}
            icon={Ruler}
            {...numberInputProps}
            placeholder="e.g. 5"
            error={errors.width}
            value={room.width}
            onChange={set("width")}
          />
        </FormField>
        <FormField id={id("length")} label="Length (m)" error={errors.length}>
          <IconInput
            id={id("length")}
            icon={Ruler}
            {...numberInputProps}
            placeholder="e.g. 5"
            error={errors.length}
            value={room.length}
            onChange={set("length")}
          />
        </FormField>
        <FormField
          id={id("people")}
          label="People per Room"
          error={errors.peoplePerRoom}
        >
          <IconInput
            id={id("people")}
            icon={UsersRound}
            {...numberInputProps}
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="1"
            error={errors.peoplePerRoom}
            value={room.peoplePerRoom}
            onChange={set("peoplePerRoom")}
          />
        </FormField>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor={id("available")}
            className="font-semibold text-brand-dark"
          >
            Status
          </Label>
          <div className="flex h-11.5 items-center gap-3">
            <Switch
              id={id("available")}
              checked={room.isAvailable}
              onCheckedChange={(checked) =>
                onChange((current) => ({ ...current, isAvailable: checked }))
              }
              className={brandSwitchClassName}
            />
            <span className="text-sm text-foreground/80">
              {room.isAvailable ? "Available" : "Occupied"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <p className="text-sm font-semibold text-brand-dark">
          Room Photos{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </p>
        <ImagePicker
          label={`Room ${index + 1} photo`}
          images={room.images}
          onChange={(update) =>
            onChange((current) => ({
              ...current,
              images: update(current.images),
            }))
          }
        />
      </div>
    </fieldset>
  )
}

export default RoomFields
