import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: number;
  nom: string;
  role: string;
  email: string;
}

export const getAllUsers = () => {
  return useMutation<UserProfile[]>({
    mutationKey: ["users"],
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("get_all_users_with_details");
      if (error) throw error;
      return data || [];
    },
  });
};

