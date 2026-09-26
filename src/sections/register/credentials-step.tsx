import { Mail } from "lucide-react"

import { FormField, IconInput, PasswordInput } from "@/components/form-field"
import type { RegisterStepProps } from "@/lib/register-form"

export function CredentialsStep({ form, errors, onChange }: RegisterStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <FormField id="email" label="Email" error={errors.email}>
        <IconInput
          id="email"
          icon={Mail}
          type="email"
          placeholder="Enter email"
          autoComplete="email"
          error={errors.email}
          value={form.email}
          onChange={(event) => onChange("email", event.target.value)}
        />
      </FormField>

      <FormField id="password" label="Password" error={errors.password}>
        <PasswordInput
          id="password"
          placeholder="Enter password"
          autoComplete="new-password"
          error={errors.password}
          value={form.password}
          onChange={(event) => onChange("password", event.target.value)}
        />
      </FormField>

      <FormField
        id="confirm-password"
        label="Confirm Password"
        error={errors.confirmPassword}
      >
        <PasswordInput
          id="confirm-password"
          placeholder="Enter confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword}
          value={form.confirmPassword}
          onChange={(event) => onChange("confirmPassword", event.target.value)}
        />
      </FormField>
    </div>
  )
}

export default CredentialsStep
