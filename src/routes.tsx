import { Navigate, Route, Routes } from "react-router-dom"

import App from "@/App"
import { AppLayout } from "@/components/AppLayout"
import { GuestOnly, RequireRole } from "@/components/route-guards"
import { ADMIN_ROLES } from "@/lib/roles"
import { AdminPage } from "@/pages/AdminPage"
import { HouseDetailPage } from "@/pages/HouseDetailPage"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"

export function AppRoutes() {
  return (
    <Routes>
      {/* Customer home: public listings, customers land here after login */}
      <Route path="/" element={<App />} />
      <Route
        path="/house/:houseId"
        element={
          <AppLayout>
            <HouseDetailPage />
          </AppLayout>
        }
      />
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
      <Route
        path="/admin"
        element={
          <RequireRole roles={ADMIN_ROLES}>
            <AdminPage />
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
