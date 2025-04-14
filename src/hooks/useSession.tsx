import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useSession() {
  return useQuery({
    queryKey: ["authSession"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw new Error("Impossible de récupérer la session.");
      return data;
    },
  });
}
