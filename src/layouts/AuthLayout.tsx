import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Le contenu des pages d'auth (formulaires) sera injecté ici */}
        <Outlet />
      </div>
    </div>
  );
}
