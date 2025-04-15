import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/dashboard/sidebar";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}