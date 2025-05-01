import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useToast } from "./use-toast";

// Schéma de validation avec Zod
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Account {
  id: number;
  nom: string;
  role: string;
  user_id: string;
}

/**
 * Hook pour gérer le processus de connexion utilisateur
 * @returns Un objet contenant les fonctions et données pour la connexion
 */
export function useLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginFormData) => {
      // 1. Authentification avec Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      console.log("authData", authData);

      // 2. Récupération des données du compte
      const { data: accountData, error: accountError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      if (accountError) throw accountError;

      return {
        user: authData.user,
        account: accountData as Account,
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.account.nom}`,
      });

      // Redirection selon le rôle de l'utilisateur
      if (data.account.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/projects");
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
    },
  });

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return {
    form,
    isLoading: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error,
    login: (data: LoginFormData) => loginMutation.mutate(data),
  };
}
