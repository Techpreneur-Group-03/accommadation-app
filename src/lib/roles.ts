// Matches public.app_role in Postgres. Renters are 'customer'.
export type AppRole = "customer" | "owner" | "admin"

// House owners use the admin side until they get a dashboard of their own.
export const ADMIN_ROLES: AppRole[] = ["admin", "owner"]

export function isAdminRole(role: AppRole | null): boolean {
  return role !== null && ADMIN_ROLES.includes(role)
}

// Where a signed-in user lands after login, signup or email confirmation.
export function homePathForRole(role: AppRole | null): string {
  return isAdminRole(role) ? "/admin" : "/"
}
