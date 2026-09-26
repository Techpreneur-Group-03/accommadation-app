import { House, MapPin, UserRound } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { RegisterStepProps, SignUpRole } from "@/lib/register-form"
import { FormField, IconInput } from "@/components/form-field"

const roleOptions: { value: SignUpRole; label: string; icon: typeof House }[] =
  [
    { value: "customer", label: "Renter", icon: UserRound },
    { value: "owner", label: "House Owner", icon: House },
  ]

export function RoleStep({ form, errors, onChange }: RegisterStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <ToggleGroup
        aria-label="Role"
        spacing={3}
        value={[form.role]}
        onValueChange={(value) => {
          // Keep one role selected: ignore clicks that would deselect it.
          const selected = roleOptions.find(
            (option) => option.value === value[0]
          )
          if (selected) onChange("role", selected.value)
        }}
      >
        {roleOptions.map(({ value, label, icon: Icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            className="h-8 rounded-full border border-brand px-4 text-brand hover:bg-brand/10 hover:text-brand aria-pressed:bg-brand aria-pressed:text-brand-foreground"
          >
            <Icon />
            {label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {form.role === "owner" && (
        <FormField id="address" label="Address" error={errors.address}>
          <IconInput
            id="address"
            icon={MapPin}
            placeholder="Enter your address"
            autoComplete="street-address"
            error={errors.address}
            value={form.address}
            onChange={(event) => onChange("address", event.target.value)}
          />
        </FormField>
      )}
    </div>
  )
}

export default RoleStep
