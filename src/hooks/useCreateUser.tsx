import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

interface CreateUserData {
  email: string;
  password: string;
  nom: string;
  role: "admin" | "client";
}

export function useCreateUser() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ email, password, nom, role }: CreateUserData) => {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );

      if (signUpError) throw signUpError;
      if (!authData.user)
        throw new Error("Erreur lors de la création de l'utilisateur");

      // 2. Créer l'entrée correspondante dans accounts
      const { error: accountError } = await supabase.from("accounts").insert([
        {
          nom,
          role,
          user_id: authData.user.id,
        },
      ]);

      if (accountError) {
        // En cas d'erreur, on essaie de supprimer l'utilisateur créé pour éviter les orphelins
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw accountError;
      }

      return { user: authData.user, nom, role };
    },
    onSuccess: (data) => {
      toast({
        title: "Utilisateur créé avec succès",
        description: `${data.nom} a été ajouté en tant que ${data.role}`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur lors de la création",
        description: error.message,
      });
    },
  });
}
