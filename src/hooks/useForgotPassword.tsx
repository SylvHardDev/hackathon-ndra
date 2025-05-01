import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

// Schéma de validation avec Zod
const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Hook pour gérer le processus de réinitialisation de mot de passe
 * @returns Un objet contenant les fonctions et données pour la réinitialisation
 */
export function useForgotPassword() {
  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email }: ForgotPasswordFormData) => {
      // Envoyer le lien de réinitialisation
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      return { email };
    },
    onSuccess: () => {
      toast.success("Email envoyé", {
        description:
          "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
      });
    },
    onError: (error) => {
      toast.error("Erreur", {
        description: error.message || "Une erreur est survenue",
      });
    },
  });

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  return {
    form,
    isLoading: forgotPasswordMutation.isPending,
    isError: forgotPasswordMutation.isError,
    error: forgotPasswordMutation.error,
    resetPassword: (data: ForgotPasswordFormData) =>
      forgotPasswordMutation.mutate(data),
  };
}
