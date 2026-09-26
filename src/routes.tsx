import { Navigate, Route, Routes } from "react-router-dom"

import App from "@/App"
import { AppLayout } from "@/components/AppLayout"
import { GuestOnly, RequireRole } from "@/components/route-guards"
import { ADMIN_ROLES } from "@/lib/roles"
import { HouseDetailPage } from "@/pages/HouseDetailPage"
import { ListingPage } from "@/pages/ListingPage"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/owner/DashboardPage"
import { ListingDetailPage } from "@/pages/owner/ListingDetailPage"
import { ListingFormPage } from "@/pages/owner/ListingFormPage"
import { ListingsPage } from "@/pages/owner/ListingsPage"
import { OwnerLayout } from "@/pages/owner/OwnerLayout"
import { RegisterPage } from "@/pages/RegisterPage"

export function AppRoutes() {
  return (
    <Routes>
      {/* Customer home: public listings, customers land here after login */}
      <Route path="/" element={<App />} />
      <Route path="/listings/:id" element={<ListingPage />} />
      <Route element={<AppLayout />}>
        <Route path="/house/:houseId" element={<HouseDetailPage />} />
      </Route>
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        }
      />

      {/* House owner portal */}
      <Route
        path="/admin"
        element={
          <RequireRole roles={ADMIN_ROLES}>
            <OwnerLayout />
          </RequireRole>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="listings" element={<ListingsPage />} />
        <Route path="listings/new" element={<ListingFormPage />} />
        <Route path="listings/:id" element={<ListingDetailPage />} />
        <Route path="listings/:id/edit" element={<ListingFormPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
