import { isAuthApiError, type Session, type User } from "@supabase/supabase-js"
import { format } from "date-fns"

import type { RegisterForm } from "@/lib/register-form"
import type { AppRole } from "@/lib/roles"
import { supabase } from "@/lib/supabase"

// "Confirm email" is on, so confirmation links land on /login, which sends
// the now signed-in user to their role's page. Add this origin as
// `<origin>/**` under Authentication > URL Configuration > Redirect URLs,
// otherwise Supabase falls back to the Site URL.
const emailRedirectTo = () => `${window.location.origin}/login`

export interface Profile {
  fullName: string | null
  phoneNumber: string | null
  role: AppRole
}

// The metadata keys are read by public.handle_new_user() to fill the profile.
// With "Confirm email" on there is no session until the user opens the link;
// if it is ever turned off, the new session signs the user in right away.
export async function signUp(form: RegisterForm): Promise<void> {
  const { data, error } = await supabase.auth.signUp({
    email: form.email.trim(),
    password: form.password,
    options: {
      emailRedirectTo: emailRedirectTo(),
      data: {
        full_name: form.fullName.trim(),
        gender: form.gender,
        date_of_birth: form.dateOfBirth
          ? format(form.dateOfBirth, "yyyy-MM-dd")
          : null,
        phone_number: form.phoneNumber.trim(),
        emergency_contact: form.emergencyContact.trim(),
        role: form.role,
        address: form.role === "owner" ? form.address.trim() : null,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  // With email confirmation on, signing up with an already registered email
  // returns no error (to hide which emails exist) but a user with no
  // identities, and no email is sent.
  if (data.user && data.user.identities?.length === 0) {
    throw new Error("An account with this email already exists")
  }
}

// Throws the Supabase AuthError as is, so callers can check its `code`
// (e.g. with isEmailNotConfirmed).
export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    throw error
  }
}

export function isEmailNotConfirmed(err: unknown): boolean {
  return isAuthApiError(err) && err.code === "email_not_confirmed"
}

export function isInvalidCredentials(err: unknown): boolean {
  return isAuthApiError(err) && err.code === "invalid_credentials"
}

export async function resendConfirmationEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: { emailRedirectTo: emailRedirectTo() },
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

// Reads the stored session. Fast, but the token isn't checked with the
// server, so pair it with getUser() before trusting it.
export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

// Asks Supabase Auth to verify the current access token and returns the user.
// Throws an AuthApiError when the session is no longer valid, e.g. the user
// was deleted or signed out elsewhere.
export async function getUser(): Promise<User> {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  return data.user
}

export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, phone_number, role")
    .eq("id", userId)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return {
    fullName: data.full_name,
    phoneNumber: data.phone_number,
    role: data.role,
  }
}

// Session to start the app with: the stored session from getSession(),
// confirmed with getUser(). A session Supabase rejects is cleared locally;
// on network errors the stored session is kept so offline reloads still work.
export async function getVerifiedSession(): Promise<Session | null> {
  const session = await getSession()
  if (!session) return null

  try {
    await getUser()
    return session
  } catch (err: unknown) {
    if (!isAuthApiError(err)) return session
    await supabase.auth.signOut({ scope: "local" })
    return null
  }
}
