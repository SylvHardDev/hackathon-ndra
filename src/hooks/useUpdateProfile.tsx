import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

interface UpdateProfileData {
  nom: string;
}

interface UpdatePasswordData {
  password: string;
}

export function useUpdateProfile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async ({ nom }: UpdateProfileData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

      const { error } = await supabase
        .from("accounts")
        .update({ nom })
        .eq("user_id", user.id);

      if (error) throw error;
      return { nom };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur lors de la mise à jour",
        description: error.message,
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ password }: UpdatePasswordData) => {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été changé avec succès",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur lors du changement de mot de passe",
        description: error.message,
      });
    },
  });

  return {
    updateProfile: updateProfileMutation.mutate,
    updatePassword: updatePasswordMutation.mutate,
    isUpdating: updateProfileMutation.isPending,
    isChangingPassword: updatePasswordMutation.isPending,
  };
}
