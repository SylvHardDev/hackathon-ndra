import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";

export function useMyAssignedProjectIds() {
  const { user } = useAuth();
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) {
        setAssignedIds([]);
        return setLoading(false);
      }

      try {
        // 1) Récupère l’ID numérique de la table accounts
        const { data: acc, error: accErr } = await supabase
          .from("accounts")
          .select("id")
          .eq("user_id", user.id)
          .single();
        if (accErr || !acc) throw accErr ?? new Error("Compte introuvable");

        // 2) Filtre project_account sur ce account_id numérique
        const { data, error: paErr } = await supabase
          .from("project_account")
          .select("project_id")
          .eq("account_id", acc.id);
        if (paErr) throw paErr;

        setAssignedIds(data.map((r) => r.project_id));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]);

  return { assignedIds, loading, error };
}
