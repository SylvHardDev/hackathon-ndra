import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";

export function useLogout() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
      navigate("/login");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur lors de la déconnexion",
        description: error.message,
      });
    },
  });

  return {
    logout: () => logoutMutation.mutate(),
    isLoading: logoutMutation.isPending,
  };
}
