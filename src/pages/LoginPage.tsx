import { useState, type FormEvent } from "react"
import { LoaderCircle, Mail, Star, X } from "lucide-react"
import { Link } from "react-router"

import { AuthCard, AuthLayout } from "@/components/auth-layout"
import { brandButtonClassName } from "@/components/field-styles"
import {
  FormAlert,
  FormField,
  IconInput,
  PasswordInput,
} from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { EMAIL_PATTERN } from "@/lib/register-form"
import { cn } from "@/lib/utils"
import {
  isEmailNotConfirmed,
  isInvalidCredentials,
  resendConfirmationEmail,
  signIn,
} from "@/services/auth"

interface LoginErrors {
  email?: string
  password?: string
}

function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {}

  if (!email.trim()) errors.email = "Email is required"
  else if (!EMAIL_PATTERN.test(email.trim()))
    errors.email = "Enter a valid email"

  if (!password) errors.password = "Password is required"

  return errors
}

function LoginDecorations() {
  return (
    <>
      {/* Corner triangles, each crossed by a thin line */}
      <svg
        viewBox="0 0 260 160"
        className="absolute top-0 right-0 w-44 sm:w-72"
      >
        <polygon points="65,0 260,0 260,160" className="fill-brand/70" />
        <line
          x1="0"
          y1="0"
          x2="260"
          y2="150"
          strokeWidth="1.5"
          className="stroke-brand"
        />
      </svg>
      <svg
        viewBox="0 0 230 190"
        className="absolute bottom-0 left-0 w-40 sm:w-64"
      >
        <polygon points="0,0 0,190 180,190" className="fill-orange-400/80" />
        <line
          x1="0"
          y1="10"
          x2="225"
          y2="190"
          strokeWidth="1.5"
          className="stroke-orange-400"
        />
      </svg>

      <div className="max-sm:hidden">
        <span className="absolute -top-4 -left-4 size-10 rounded-full border-2 border-brand/60" />
        <span className="absolute top-[30%] left-[13%] size-7 rounded-full bg-orange-300/80" />
        <span className="absolute top-[44%] -left-2 size-4 rounded-full bg-orange-300/80" />
        <span className="absolute top-[68%] left-[17%] size-7 rounded-full border-2 border-brand/60" />
        <span className="absolute top-[60%] right-[7%] size-7 rounded-full border-2 border-brand/60" />

        <X className="absolute top-[3%] left-[30%] size-7 text-brand" />
        <X className="absolute right-[9%] bottom-[4%] size-6 text-brand" />
        <Star className="absolute top-[24%] right-[14%] size-7 text-orange-400" />
        <Star className="absolute bottom-[3%] left-[33%] size-7 text-brand" />
      </div>
    </>
  )
}

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<LoginErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateLogin(email, password)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    setSubmitError(null)
    setNeedsConfirmation(false)
    setNotice(null)
    try {
      // On success the auth listener picks up the session and the GuestOnly
      // route sends the user to their role's page.
      await signIn(email, password)
    } catch (err: unknown) {
      if (isEmailNotConfirmed(err)) {
        setNeedsConfirmation(true)
        setSubmitError(
          "Please confirm your email first. Check your inbox for the confirmation link."
        )
      } else if (isInvalidCredentials(err)) {
        setSubmitError("Incorrect email or password.")
      } else {
        setSubmitError(err instanceof Error ? err.message : "Failed to log in")
      }
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await resendConfirmationEmail(email)
      setSubmitError(null)
      setNeedsConfirmation(false)
      setNotice(`We sent a new confirmation link to ${email.trim()}.`)
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to resend the email"
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout
      decorations={<LoginDecorations />}
      className="justify-center sm:pb-32"
    >
      <AuthCard className="max-w-md">
        <form noValidate onSubmit={handleSubmit} className="flex flex-col">
          <h1 className="text-center font-heading text-2xl font-bold text-brand-dark">
            Login
          </h1>
          <p className="mt-2 text-center text-sm text-brand-dark/80">
            Welcome back! Please input your credentials.
          </p>

          <div className="mt-7 flex flex-col gap-5">
            <FormField id="email" label="Email" error={errors.email}>
              <IconInput
                id="email"
                icon={Mail}
                type="email"
                placeholder="Enter email"
                autoComplete="email"
                error={errors.email}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setErrors((previous) => ({ ...previous, email: undefined }))
                }}
              />
            </FormField>

            <FormField id="password" label="Password" error={errors.password}>
              <PasswordInput
                id="password"
                placeholder="Enter password"
                autoComplete="current-password"
                error={errors.password}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setErrors((previous) => ({
                    ...previous,
                    password: undefined,
                  }))
                }}
              />
            </FormField>
          </div>

          {/* Password reset isn't built yet (needs an update-password page). */}
          <button
            type="button"
            disabled
            title="Coming soon"
            className="mt-3 self-end text-xs text-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            Forgot Password?
          </button>

          {submitError && (
            <FormAlert className="mt-4">
              <p>{submitError}</p>
              {needsConfirmation && (
                <button
                  type="button"
                  disabled={isResending}
                  onClick={handleResend}
                  className="mt-1 font-medium underline underline-offset-4 disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend confirmation email"}
                </button>
              )}
            </FormAlert>
          )}
          {notice && (
            <FormAlert variant="info" className="mt-4">
              {notice}
            </FormAlert>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(brandButtonClassName, "mt-5")}
          >
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-orange-500 underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}

export default LoginPage
