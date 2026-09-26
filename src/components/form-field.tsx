import { useState, type ComponentProps, type ReactNode } from "react"
import { Eye, EyeOff, KeyRound, type LucideIcon } from "lucide-react"

import { errorId, fieldClassName } from "@/components/field-styles"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}

export function FormField({
  id,
  label,
  error,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="font-semibold text-brand-dark">
        {label}
      </Label>
      {children}
      {error && (
        <p id={errorId(id)} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

interface IconInputProps extends ComponentProps<"input"> {
  id: string
  icon: LucideIcon
  error?: string
  endAddon?: ReactNode
}

export function IconInput({
  id,
  icon: Icon,
  error,
  endAddon,
  className,
  ...props
}: IconInputProps) {
  return (
    <InputGroup className={fieldClassName}>
      <InputGroupAddon className="p-0 pr-1">
        <Icon className="size-4 text-muted-foreground/80" />
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId(id) : undefined}
        className={cn(
          "h-full py-0 pr-0 text-sm placeholder:text-muted-foreground/70",
          className
        )}
        {...props}
      />
      {endAddon && (
        <InputGroupAddon align="inline-end" className="p-0">
          {endAddon}
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

type PasswordInputProps = Omit<IconInputProps, "icon" | "type" | "endAddon">

export function PasswordInput(props: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = isVisible ? EyeOff : Eye

  return (
    <IconInput
      icon={KeyRound}
      type={isVisible ? "text" : "password"}
      endAddon={
        <InputGroupButton
          size="icon-xs"
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="text-muted-foreground/80 hover:bg-transparent"
          onClick={() => setIsVisible((visible) => !visible)}
        >
          <Icon />
        </InputGroupButton>
      }
      {...props}
    />
  )
}

interface FormAlertProps {
  variant?: "error" | "info"
  className?: string
  children: ReactNode
}

// Form-level message, e.g. an error returned by Supabase.
export function FormAlert({
  variant = "error",
  className,
  children,
}: FormAlertProps) {
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg px-3 py-2 text-sm",
        variant === "error"
          ? "bg-destructive/10 text-destructive"
          : "bg-brand/10 text-brand-dark",
        className
      )}
    >
      {children}
    </div>
  )
}
