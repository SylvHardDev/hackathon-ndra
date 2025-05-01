import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";

// Schéma de validation pour la réinitialisation du mot de passe
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Hook pour gérer le processus de définition d'un nouveau mot de passe
 * @returns Un objet contenant les fonctions et données pour la réinitialisation
 */
export function useResetPassword() {
  const navigate = useNavigate();

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: ResetPasswordFormData) => {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Mot de passe mis à jour", {
        description: "Votre mot de passe a été réinitialisé avec succès",
      });
      navigate("/login");
    },
    onError: (error) => {
      toast.error("Erreur", {
        description: error.message || "Une erreur est survenue",
      });
    },
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return {
    form,
    isLoading: resetPasswordMutation.isPending,
    isError: resetPasswordMutation.isError,
    error: resetPasswordMutation.error,
    resetPassword: (data: ResetPasswordFormData) =>
      resetPasswordMutation.mutate(data),
  };
}
