import { Routes, Route } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import MainLayout from "@/layouts/MainLayout";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import { ThemeProvider } from "@/components/dashboard/theme-provider";
import { Profile } from "@/pages/dashboard/profile";
import { ProjectManagement } from "@/pages/dashboard/project-management";
import { UserManagement } from "@/pages/dashboard/user-management";
import ProjectDetail from "@/pages/dashboard/project-detail";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Routes publiques */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Routes d'authentification */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Routes protégées */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profiledashboard" element={<Profile />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/projects" element={<ProjectManagement />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Route>

        {/* Page 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}
