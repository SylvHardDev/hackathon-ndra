import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export const useRole = () => {
  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: account, error } = await supabase
        .from("accounts")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return account?.role;
    },
  });

  const isAdmin = userRole === "admin";

  return {
    userRole,
    isAdmin,
    isLoading,
  };
};
