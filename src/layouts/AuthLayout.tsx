import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { userStatus } = useAuth();
  const accessToken = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refresh_token");

  if (userStatus === "signed-out" && (!accessToken || !refreshToken)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Le contenu des pages d'auth (formulaires) sera injecté ici */}
        <Outlet />
      </div>
    </div>
  );
}
