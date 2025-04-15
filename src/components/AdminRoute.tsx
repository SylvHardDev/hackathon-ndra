import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function AdminRoute() {
  const navigate = useNavigate();
  const { data: sessionData, isLoading } = useSession();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!sessionData?.session) {
        navigate("/login");
        return;
      }

      const { data: accountData } = await supabase
        .from("accounts")
        .select("role")
        .eq("user_id", sessionData.session.user.id)
        .single();

      if (!accountData || accountData.role !== "admin") {
        navigate("/profile");
      }
    };

    if (!isLoading) {
      checkAdminAccess();
    }
  }, [sessionData, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <Outlet />;
}
