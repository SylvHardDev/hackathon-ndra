import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ProjectUser {
  project_id: number;
  account_id: number;
  account: {
    id: number;
    nom: string;
    role: string;
  };
}

export function useProjectUsers(projectId: number) {
  const [users, setUsers] = useState<ProjectUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("project_account")
        .select(
          `
          project_id,
          account_id,
          account:accounts (
            id,
            nom,
            role
          )
        `
        )
        .eq("project_id", projectId)
        .order("account_id", { ascending: true });

      if (error) throw error;
      console.log("Raw data from Supabase:", data);
      setUsers(data as unknown as ProjectUser[]);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (accountId: number) => {
    try {
      const { data, error } = await supabase
        .from("project_account")
        .insert([
          {
            project_id: projectId,
            account_id: accountId,
          },
        ])
        .select(
          `
          project_id,
          account_id,
          account:accounts (
            id,
            nom,
            role
          )
        `
        )
        .single();

      if (error) throw error;
      if (data) {
        setUsers((prev) => [...prev, data as unknown as ProjectUser]);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return null;
    }
  };

  const removeUser = async (accountId: number) => {
    try {
      const { error } = await supabase
        .from("project_account")
        .delete()
        .eq("project_id", projectId)
        .eq("account_id", accountId);

      if (error) throw error;
      setUsers((prev) => prev.filter((u) => u.account_id !== accountId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return false;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchUsers();
    }
  }, [projectId]);

  return {
    users,
    loading,
    error,
    addUser,
    removeUser,
    refreshUsers: fetchUsers,
  };
}
