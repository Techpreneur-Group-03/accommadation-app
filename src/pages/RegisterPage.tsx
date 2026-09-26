import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowLeft, LoaderCircle, MailCheck, Star, X } from "lucide-react"
import { Link } from "react-router-dom"

import { AuthCard, AuthLayout } from "@/components/auth-layout"
import { brandButtonClassName } from "@/components/field-styles"
import { FormAlert } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import {
  emptyRegisterForm,
  validateCredentials,
  validatePersonalInfo,
  validateRole,
  type RegisterErrors,
  type RegisterForm,
  type RegisterStepProps,
} from "@/lib/register-form"
import { cn } from "@/lib/utils"
import { CredentialsStep } from "@/sections/register/credentials-step"
import { PersonalInfoStep } from "@/sections/register/personal-info-step"
import { RoleStep } from "@/sections/register/role-step"
import { signUp } from "@/services/auth"

const formSteps = [
  {
    title: "Personal Information",
    description: "Please fill in your basic information in the form below.",
    validate: validatePersonalInfo,
    Fields: PersonalInfoStep,
  },
  {
    title: "Credentials Information",
    description:
      "Please fill in your credentials for registration in the form below.",
    validate: validateCredentials,
    Fields: CredentialsStep,
  },
  {
    title: "Which role fits your desire?",
    description: "Please select one of the below option.",
    validate: validateRole,
    Fields: RoleStep,
  },
] satisfies {
  title: string
  description: string
  validate: (form: RegisterForm) => RegisterErrors
  Fields: (props: RegisterStepProps) => React.ReactNode
}[]

// The form steps plus the final confirmation step.
const TOTAL_STEPS = formSteps.length + 1

function StepProgress({ current }: { current: number }) {
  return (
    <div
      role="progressbar"
      aria-label="Registration progress"
      aria-valuemin={1}
      aria-valuemax={TOTAL_STEPS}
      aria-valuenow={current + 1}
      className="flex gap-2"
    >
      {Array.from({ length: TOTAL_STEPS }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-1 w-10 rounded-full transition-colors",
            index <= current ? "bg-brand" : "bg-muted-foreground/15"
          )}
        />
      ))}
    </div>
  )
}

function RegisterDecorations() {
  return (
    <>
      <div className="absolute -top-28 -right-28 size-56 rounded-full bg-brand/60 shadow-[-10px_10px_0_0_var(--color-background)] ring-12 ring-brand/10 sm:-top-40 sm:-right-40 sm:size-105" />
      <div className="absolute -bottom-40 -left-24 size-64 rounded-full border-2 border-orange-400 bg-background shadow-[0_-6px_24px_rgba(15,23,42,0.08)] sm:-bottom-56 sm:size-96" />

      <div className="max-sm:hidden">
        <span className="absolute top-3 left-[62%] size-5 rounded-full border-2 border-brand/60" />
        <span className="absolute bottom-10 left-[38%] size-6 rounded-full border-2 border-brand/60" />
        <span className="absolute top-[22%] right-[26%] size-4 rounded-full bg-orange-300/70" />
        <span className="absolute top-1/2 -left-1.5 size-3 rounded-full bg-brand/70" />

        <X className="absolute top-[34%] left-[14%] size-4 text-orange-400" />
        <X className="absolute right-[3%] bottom-[14%] size-5 text-brand" />
        <Star className="absolute bottom-[22%] left-[9%] size-5 text-brand/80" />
        <Star className="absolute top-[52%] right-[12%] size-3.5 text-brand/80" />
      </div>
    </>
  )
}

function LoginPrompt() {
  return (
    <p className="text-center text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-medium text-orange-500 underline-offset-4 hover:underline"
      >
        Login
      </Link>
    </p>
  )
}

export function RegisterPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(emptyRegisterForm)
  const [errors, setErrors] = useState<RegisterErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const shouldFocusHeading = useRef(false)

  // Move focus to the new step's heading so keyboard and screen reader
  // users land at the top of the step instead of on a removed button.
  useEffect(() => {
    if (!shouldFocusHeading.current) return
    shouldFocusHeading.current = false
    headingRef.current?.focus()
  }, [step])

  const goToStep = (next: number) => {
    shouldFocusHeading.current = true
    setErrors({})
    setSubmitError(null)
    setStep(next)
  }

  const updateField: RegisterStepProps["onChange"] = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }))
    setErrors((previous) =>
      previous[key] ? { ...previous, [key]: undefined } : previous
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const stepErrors = formSteps[step].validate(form)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length > 0) return

    if (step < formSteps.length - 1) {
      goToStep(step + 1)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)
    try {
      // If Supabase returns a session (email confirmation off), the GuestOnly
      // route redirects by role before the confirmation step shows.
      await signUp(form)
      goToStep(formSteps.length)
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create account"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isComplete = step === formSteps.length
  const currentStep = formSteps[step]

  return (
    <AuthLayout decorations={<RegisterDecorations />} className="gap-8">
      <StepProgress current={step} />

      <AuthCard className="max-w-xl">
        {isComplete ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <MailCheck className="size-12 text-brand" />
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-2xl font-bold text-brand-dark outline-none"
            >
              Check your email
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              We sent a confirmation link to{" "}
              <span className="font-medium text-foreground">
                {form.email.trim()}
              </span>
              . Open it to activate your account, then you&apos;ll be signed in
              automatically.
            </p>
            <Button
              render={<Link to="/login" />}
              nativeButton={false}
              className={cn(brandButtonClassName, "mt-4")}
            >
              Go to login
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="flex flex-col">
            {step > 0 && (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => goToStep(step - 1)}
                className="mb-3 flex w-fit items-center gap-1.5 text-sm text-brand transition-colors hover:text-brand/80 disabled:opacity-50"
              >
                <ArrowLeft className="size-4" />
                Back
              </button>
            )}

            <h1
              ref={headingRef}
              tabIndex={-1}
              className="font-heading text-2xl font-bold text-brand-dark outline-none"
            >
              {currentStep.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentStep.description}
            </p>

            <div className="mt-6">
              <currentStep.Fields
                form={form}
                errors={errors}
                onChange={updateField}
              />
            </div>

            {submitError && (
              <FormAlert className="mt-5">{submitError}</FormAlert>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(brandButtonClassName, "mt-7")}
            >
              {isSubmitting && <LoaderCircle className="animate-spin" />}
              {isSubmitting ? "Creating account..." : "Continue"}
            </Button>

            {step < formSteps.length - 1 && (
              <div className="mt-4">
                <LoginPrompt />
              </div>
            )}
          </form>
        )}
      </AuthCard>
    </AuthLayout>
  )
}

export default RegisterPage
