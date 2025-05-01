import { useRole } from "@/hooks/useRole";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminProtectedRoute() {
  const { isAdmin, isLoading } = useRole();

  // Pendant le chargement, afficher un indicateur de chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Si l'utilisateur n'est pas un administrateur, le rediriger vers la page des projets
  if (!isAdmin) {
    return <Navigate to="/projects" replace />;
  }

  // Si l'utilisateur est un administrateur, autoriser l'accès
  return <Outlet />;
}
