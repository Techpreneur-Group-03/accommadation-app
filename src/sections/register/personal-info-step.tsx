import { useState } from "react"
import { format } from "date-fns"
import { CalendarDays, Phone, PhoneCall, UserRound, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  genderOptions,
  type Gender,
  type RegisterStepProps,
} from "@/lib/register-form"
import { cn } from "@/lib/utils"
import { errorId, fieldClassName } from "@/components/field-styles"
import { FormField, IconInput } from "@/components/form-field"

const EARLIEST_BIRTH_MONTH = new Date(1900, 0)

export function PersonalInfoStep({
  form,
  errors,
  onChange,
}: RegisterStepProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const today = new Date()

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
      <FormField id="full-name" label="Full Name" error={errors.fullName}>
        <IconInput
          id="full-name"
          icon={UserRound}
          placeholder="Enter full name"
          autoComplete="name"
          error={errors.fullName}
          value={form.fullName}
          onChange={(event) => onChange("fullName", event.target.value)}
        />
      </FormField>

      <FormField id="gender" label="Gender" error={errors.gender}>
        <Select
          items={genderOptions}
          value={form.gender}
          onValueChange={(value: Gender | null) => onChange("gender", value)}
        >
          <SelectTrigger
            id="gender"
            aria-invalid={Boolean(errors.gender)}
            aria-describedby={errors.gender ? errorId("gender") : undefined}
            className={cn(fieldClassName, "w-full data-[size=default]:h-11.5")}
          >
            <Users className="size-4 text-muted-foreground/80" />
            <SelectValue
              placeholder="Select gender"
              className="data-placeholder:text-muted-foreground/70"
            />
          </SelectTrigger>
          <SelectContent>
            {genderOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField
        id="date-of-birth"
        label="Date of Birth"
        error={errors.dateOfBirth}
      >
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger
            render={
              <Button
                id="date-of-birth"
                variant="ghost"
                aria-invalid={Boolean(errors.dateOfBirth)}
                aria-describedby={
                  errors.dateOfBirth ? errorId("date-of-birth") : undefined
                }
                className={cn(
                  fieldClassName,
                  "w-full justify-start gap-2 font-normal hover:bg-muted"
                )}
              />
            }
          >
            <CalendarDays className="text-muted-foreground/80" />
            {form.dateOfBirth ? (
              format(form.dateOfBirth, "dd MMM yyyy")
            ) : (
              <span className="text-muted-foreground/70">
                Select date of birth
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              selected={form.dateOfBirth ?? undefined}
              defaultMonth={form.dateOfBirth ?? new Date(2000, 0)}
              startMonth={EARLIEST_BIRTH_MONTH}
              endMonth={today}
              disabled={{ after: today }}
              classNames={{
                day_button:
                  "data-[selected-single=true]:bg-brand data-[selected-single=true]:text-brand-foreground",
              }}
              onSelect={(date) => {
                onChange("dateOfBirth", date ?? null)
                setIsCalendarOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </FormField>

      <FormField
        id="phone-number"
        label="Phone Number"
        error={errors.phoneNumber}
      >
        <IconInput
          id="phone-number"
          icon={Phone}
          type="tel"
          placeholder="Enter phone number"
          autoComplete="tel"
          error={errors.phoneNumber}
          value={form.phoneNumber}
          onChange={(event) => onChange("phoneNumber", event.target.value)}
        />
      </FormField>

      <FormField
        id="emergency-contact"
        label="Emergency Contact"
        error={errors.emergencyContact}
        className="sm:col-span-2"
      >
        <IconInput
          id="emergency-contact"
          icon={PhoneCall}
          type="tel"
          placeholder="Enter emergency contact number"
          error={errors.emergencyContact}
          value={form.emergencyContact}
          onChange={(event) => onChange("emergencyContact", event.target.value)}
        />
      </FormField>
    </div>
  )
}

export default PersonalInfoStep
