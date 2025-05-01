import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const { userStatus, user } = useAuth();
  const location = useLocation();

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

    // Sinon, redirection normale vers le dashboard
    return <Navigate to="/dashboard" replace />;
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
