import { supabase } from "@/lib/supabase";
import { AuthError, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [userStatus, setUserStatus] = useState<
    "loading" | "signed-in" | "signed-out"
  >("loading");
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === "INITIAL_SESSION") {
            setUser(session?.user ?? null);
            setUserStatus(session ? "signed-in" : "signed-out");
          } else if (event === "SIGNED_IN") {
            setUser(session?.user ?? null);
            setUserStatus("signed-in");
            setError(null);
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setUserStatus("signed-out");
            setError(null);
          } else if (event === "PASSWORD_RECOVERY") {
            // Gérer la récupération de mot de passe
            console.log("Password recovery flow initiated");
          } else if (event === "TOKEN_REFRESHED") {
            // Le token a été rafraîchi avec succès
            console.log("Token refreshed successfully");
          } else if (event === "USER_UPDATED") {
            setUser(session?.user ?? null);
            // Les informations de l'utilisateur ont été mises à jour
            console.log("User information updated");
          }
        } catch (err) {
          console.error("Auth state change error:", err);
          setError(err as AuthError);
          setUserStatus("signed-out");
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, userStatus, error };
}
