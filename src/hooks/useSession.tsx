import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

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
