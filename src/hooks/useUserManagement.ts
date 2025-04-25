import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface User {
  id: number;
  email: string;
  nom: string;
  role: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast.error(
        "Une erreur est survenue lors de la récupération des utilisateurs"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      const { error } = await supabase
        .from("accounts")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success("Le rôle a été mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast.error("Une erreur est survenue lors de la mise à jour du rôle");
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      toast.success("L'utilisateur a été supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast.error(
        "Une erreur est survenue lors de la suppression de l'utilisateur"
      );
    }
  };

  const createUser = async (userData: Omit<User, "id">) => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      setUsers((prevUsers) => [...prevUsers, data]);

      toast.success("L'utilisateur a été créé avec succès");

      return data;
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      toast.error(
        "Une erreur est survenue lors de la création de l'utilisateur"
      );
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    updateUserRole,
    deleteUser,
    createUser,
    fetchUsers,
  };
}
