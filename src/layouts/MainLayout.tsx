import { Outlet } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export default function MainLayout() {
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
