import { useRef } from "react"
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import type { SearchFilters } from "@/lib/filter-houses"

const filterFields = [
  {
    id: "location",
    key: "location",
    label: "Location",
    placeholder: "Enter your location",
    icon: MapPin,
    type: "text",
  },
  {
    id: "people-per-room",
    key: "peoplePerRoom",
    label: "People per room",
    placeholder: "Enter number of people per room",
    icon: UserRound,
    type: "number",
  },
  {
    id: "minimum-price",
    key: "minPrice",
    label: "Minimum Price",
    placeholder: "Enter the minimum price",
    icon: CircleDollarSign,
    type: "number",
  },
] as const

interface SearchFilterSectionProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
}

export function SearchFilterSection({
  filters,
  onFiltersChange,
}: SearchFilterSectionProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const updateFilter = (key: keyof SearchFilters, value: string) =>
    onFiltersChange({ ...filters, [key]: value })

  return (
    <Collapsible render={<section />} className="flex w-full flex-col">
      <form
        className="flex items-center gap-0 md:gap-12"
        onSubmit={(event) => event.preventDefault()}
      >
        <InputGroup className="h-12.5 flex-1 rounded-full border-transparent bg-card pr-1.5 pl-6 shadow-[0_4px_16px_rgba(15,23,42,0.08)] dark:bg-card">
          <InputGroupInput
            ref={searchInputRef}
            type="search"
            placeholder="Search for house’s name or house’s owner"
            aria-label="Search accommodations"
            className="h-full px-0 text-[15px] placeholder:text-muted-foreground"
            value={filters.query}
            onChange={(event) => updateFilter("query", event.target.value)}
          />
          <InputGroupAddon align="inline-end" className="p-0 has-[>button]:mr-0">
            <InputGroupButton
              type="submit"
              size="icon-sm"
              className="size-9 rounded-full bg-brand text-brand-foreground hover:bg-brand/90 hover:text-brand-foreground"
              aria-label="Search"
              onClick={() => searchInputRef.current?.focus()}
            >
              <Search className="size-4.5" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        <CollapsibleTrigger
          render={
            <Button
              type="button"
              className="h-10.5 gap-2 rounded-full bg-brand-dark px-4.5 text-[15px] font-normal text-brand-dark-foreground hover:bg-brand-dark/90"
            />
          }
        >
          <Settings2 className="size-4" />
          Filter
        </CollapsibleTrigger>
      </form>

      {/* Negative margin + padding keeps the Card's shadow from being clipped */}
      <CollapsibleContent className="-mx-2 -mb-4 h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0">
        <div className="px-2 pt-3.5 pb-4">
          <Card className="grid grid-cols-1 gap-x-9 gap-y-5 rounded-2xl px-7 py-6 shadow-[0_4px_20px_rgba(15,23,42,0.06)] ring-0 md:grid-cols-3">
            {filterFields.map(({ id, key, label, placeholder, icon: Icon, type }) => (
              <div key={id} className="flex flex-col gap-3">
                <Label htmlFor={id} className="text-[15px] font-normal text-foreground/80">
                  {label}
                </Label>
                <InputGroup className="h-11.5 rounded-lg border-transparent bg-muted/70 px-3.5 shadow-none dark:bg-muted">
                  <InputGroupAddon className="p-0 pr-1">
                    <Icon className="size-4 text-muted-foreground/80" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={id}
                    type={type}
                    min={type === "number" ? 0 : undefined}
                    placeholder={placeholder}
                    className="h-full py-0 pr-0 text-sm placeholder:text-muted-foreground/70"
                    value={filters[key]}
                    onChange={(event) => updateFilter(key, event.target.value)}
                  />
                </InputGroup>
              </div>
            ))}
          </Card>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
