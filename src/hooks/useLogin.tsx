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

export interface Account {
  id: number;
  nom: string;
  role: "admin" | "client";
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

      // 2. Récupération des données du compte
      const { data: accountData, error: accountError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", authData.user.id)
        .single();

      if (accountError) throw accountError;

      const account = accountData as Account;

      // Stocker les informations du compte dans le localStorage
      localStorage.setItem("userRole", account.role);
      localStorage.setItem("userName", account.nom);

      return {
        user: authData.user,
        account,
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${data.account.nom}`,
      });

      // Redirection basée sur le rôle
      if (data.account.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/profile"); // Redirection des utilisateurs non-admin vers leur profil
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
