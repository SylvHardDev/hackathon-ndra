// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";
import MainLayout from "@/layouts/MainLayout";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Routes d'authentification */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Routes protégées */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Page 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
