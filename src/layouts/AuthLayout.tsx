import useAuth from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AuthLayout() {
  const { userStatus } = useAuth();
  const { isAdmin, isLoading } = useRole();
  const location = useLocation();
  const accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (userStatus === "signed-out" && (!accessToken || !refreshToken)) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Chargement...
      </div>
    );
  }

  const isDashboardRoute =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/users") ||
    location.pathname.startsWith("/projects") ||
    location.pathname.startsWith("/profiledashboard");

  if (isDashboardRoute && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {/* Le contenu des pages d'auth (formulaires) sera injecté ici */}
      <Outlet />
    </>
  );
}
