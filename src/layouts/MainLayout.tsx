import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import useAuth from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function MainLayout() {
  const { userStatus } = useAuth();

  if (userStatus === "signed-in") {
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
