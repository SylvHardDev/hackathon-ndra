import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface User {
  id: number;
  user_id: string;
  email?: string;
  nom?: string;
  role?: string;
}

export function useAssignUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Charger la liste des utilisateurs
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorMessage(null);

    try {
      const { data: allUsers, error: usersError } = await supabase
        .from("accounts")
        .select("id, user_id, nom, role")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;
      setUsers(allUsers || []);
    } catch (err) {
      setErrorMessage((err as Error).message);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoadingUsers(false);
    }
  };

  // Filtre des utilisateurs basé sur la recherche
  const filterUsers = (users: User[], searchQuery: string) => {
    return users.filter(
      (user) =>
        user.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return {
    users,
    loadingUsers,
    errorMessage,
    fetchUsers,
    filterUsers,
  };
} 