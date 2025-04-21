import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  nom: string;
  image_url?: string;
  role: string;
  email: string;
}

export const useUser = (userId: string | undefined) => {
  return useQuery<UserProfile[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("accounts_with_email")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      return data || [];
    },
    enabled: !!userId,
  });
};
