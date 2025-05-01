import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRole } from "@/hooks/useRole";

export default function MainLayout() {
  const { userStatus, user } = useAuth();
  const location = useLocation();
  const { userRole, isAdmin, isLoading: roleLoading } = useRole();

  if (userStatus === "signed-in") {
    // Si l'utilisateur est sur la page de réinitialisation de mot de passe, on le laisse y accéder
    if (location.pathname === "/reset-password") {
      return <Outlet />;
    }

    // Vérifier si l'utilisateur a besoin de réinitialiser son mot de passe
    const needsPasswordReset =
      user?.user_metadata?.needs_password_reset === true ||
      user?.user_metadata?.initial_user === true;

    if (needsPasswordReset) {
      return <Navigate to="/reset-password" replace />;
    }

    // Si l'utilisateur est admin, le rediriger vers le dashboard, sinon vers la page des projets
    if (!roleLoading) {
      if (isAdmin) {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/projects" replace />;
      }
    }

    // Pendant le chargement du rôle, afficher un indicateur de chargement
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar personnalisé ou wrapper d'un composant shadcn/ui */}
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
