import { ThemeProvider } from "@/components/dashboard/theme-provider";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import MainLayout from "@/layouts/MainLayout";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import UserPage from "@/pages/UserPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import { Profile } from "@/pages/dashboard/profile";
import { ProjectManagement } from "@/pages/dashboard/project-management";
import { UserManagement } from "@/pages/dashboard/user-management";
import { Route, Routes } from "react-router-dom";
import ProjectDetail from "@/pages/dashboard/project-detail";
import VideoEditPage from "@/pages/dashboard/Projects/VideoEditPage";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* Routes publiques */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Routes protégées */}
        <Route element={<AuthLayout />}>
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Route pour les utilisateurs non-admin */}
          <Route path="/user-profile" element={<UserPage />} />

          {/* Routes Admin (protégées par AuthLayout) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profiledashboard" element={<Profile />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/projects" element={<ProjectManagement />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route
              path="/dashboard/projects/:projectId/video-edit"
              element={<VideoEditPage />}
            />
          </Route>
        </Route>

        {/* Page 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}
