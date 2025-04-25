import useAuth from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { userStatus } = useAuth();
  const { isLoading } = useRole();
  const accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (userStatus === "signed-out" && (!accessToken || !refreshToken)) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      {/* Le contenu des pages d'auth (formulaires) sera injecté ici */}
      <Outlet />
    </>
  );
}
