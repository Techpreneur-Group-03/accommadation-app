import type { AppRole } from "@/lib/roles"

export type Gender = "male" | "female" | "other"

// Admin can't be picked at signup; it's granted in the SQL Editor.
export type SignUpRole = Exclude<AppRole, "admin">

export interface RegisterForm {
  fullName: string
  gender: Gender | null
  dateOfBirth: Date | null
  phoneNumber: string
  emergencyContact: string
  email: string
  password: string
  confirmPassword: string
  role: SignUpRole
  address: string
}

export type RegisterErrors = Partial<Record<keyof RegisterForm, string>>

export const emptyRegisterForm: RegisterForm = {
  fullName: "",
  gender: null,
  dateOfBirth: null,
  phoneNumber: "",
  emergencyContact: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "customer",
  address: "",
}

export const genderOptions: { value: Gender; label: string }[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
]

export const MIN_PASSWORD_LENGTH = 8

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Digits with optional leading +, spaces or dashes, e.g. "012 345 678".
const PHONE_PATTERN = /^\+?[\d\s-]{8,20}$/

function validatePhone(value: string, label: string) {
  if (!value.trim()) return `${label} is required`
  if (!PHONE_PATTERN.test(value.trim()))
    return `Enter a valid ${label.toLowerCase()}`
}

export function validatePersonalInfo(form: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {}

  if (!form.fullName.trim()) errors.fullName = "Full name is required"
  if (!form.gender) errors.gender = "Gender is required"
  if (!form.dateOfBirth) errors.dateOfBirth = "Date of birth is required"

  const phoneError = validatePhone(form.phoneNumber, "Phone number")
  if (phoneError) errors.phoneNumber = phoneError

  const emergencyError = validatePhone(
    form.emergencyContact,
    "Emergency contact"
  )
  if (emergencyError) errors.emergencyContact = emergencyError

  return errors
}

export function validateCredentials(form: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {}

  if (!form.email.trim()) errors.email = "Email is required"
  else if (!EMAIL_PATTERN.test(form.email.trim()))
    errors.email = "Enter a valid email"

  if (!form.password) errors.password = "Password is required"
  else if (form.password.length < MIN_PASSWORD_LENGTH)
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`

  if (!form.confirmPassword) errors.confirmPassword = "Confirm your password"
  else if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Passwords do not match"

  return errors
}

export function validateRole(form: RegisterForm): RegisterErrors {
  const errors: RegisterErrors = {}

  if (form.role === "owner" && !form.address.trim())
    errors.address = "Address is required"

  return errors
}

export interface RegisterStepProps {
  form: RegisterForm
  errors: RegisterErrors
  onChange: <K extends keyof RegisterForm>(
    key: K,
    value: RegisterForm[K]
  ) => void
}
