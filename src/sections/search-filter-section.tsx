import {
  CircleDollarSign,
  MapPin,
  Search,
  Settings2,
  UserRound,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"

const filters = [
  {
    id: "location",
    label: "Location",
    placeholder: "Enter your location",
    icon: MapPin,
    type: "text",
  },
  {
    id: "people-per-room",
    label: "People per room",
    placeholder: "Enter number of people per room",
    icon: UserRound,
    type: "number",
  },
  {
    id: "minimum-price",
    label: "Minimum Price",
    placeholder: "Enter the minimum price",
    icon: CircleDollarSign,
    type: "number",
  },
] as const

export function SearchFilterSection() {
  return (
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-13">
        <InputGroup className="h-auto flex-1 rounded-full border-transparent bg-card py-2 pr-3 pl-5 shadow-md dark:bg-card">
          <InputGroupInput
            type="search"
            placeholder="Search for house’s name or house’s owner"
            aria-label="Search accommodations"
            className="h-10 px-0 text-base placeholder:text-muted-foreground"
          />
          <InputGroupAddon align="inline-end" className="p-0">
            <InputGroupButton
              size="icon-sm"
              className="size-10 rounded-full bg-brand text-brand-foreground hover:bg-brand/90 hover:text-brand-foreground"
              aria-label="Search"
            >
              <Search className="size-5" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <Button className="h-12 gap-2 rounded-full bg-brand-dark px-6 text-base text-brand-dark-foreground hover:bg-brand-dark/90">
          <Settings2 className="size-5" />
          Filter
        </Button>
      </div>

      <Card className="grid grid-cols-1 gap-x-10 gap-y-6 rounded-panel p-8 shadow-md ring-0 md:grid-cols-3">
        {filters.map(({ id, label, placeholder, icon: Icon, type }) => (
          <div key={id} className="flex flex-col gap-2">
            <Label htmlFor={id} className="text-base font-medium">
              {label}
            </Label>
            <InputGroup className="h-auto rounded-field border-transparent bg-muted px-4 py-3 shadow-none dark:bg-muted">
              <InputGroupAddon className="p-0 pr-1">
                <Icon className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                id={id}
                type={type}
                min={type === "number" ? 0 : undefined}
                placeholder={placeholder}
                className="h-5 py-0 pr-0"
              />
            </InputGroup>
          </div>
        ))}
      </Card>
    </section>
  )
}
