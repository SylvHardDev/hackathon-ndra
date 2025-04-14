import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        {/* Navbar personnalisé ou wrapper d'un composant shadcn/ui */}
        <Navbar />
      </header>
      <main className="flex-grow">
        {/* Le contenu de la page sera injecté ici */}
        <Outlet />
      </main>
      <footer>
        {/* Footer de l'application */}
        <Footer />
      </footer>
    </div>
  );
}
