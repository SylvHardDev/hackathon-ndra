import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2 } from "lucide-react";
import CreateUserDialog from "./CreateUserDialog";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRole } from "@/hooks/useRole";
import { getAllUsers } from "../../hooks/getAllUsers";

interface User {
  id: number;
  nom: string;
  role: string;
  email: string;
}

export function UserManagement() {
  const { isAdmin } = useRole();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const getUsersMutation = getAllUsers();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await getUsersMutation.mutateAsync();
      setUsers(result);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast.error("Impossible de récupérer la liste des utilisateurs");
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

      if (error) throw error;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success("Le rôle de l'utilisateur a été mis à jour");
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

      toast.success("L'utilisateur a été supprimé");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast.error(
        "Une erreur est survenue lors de la suppression de l'utilisateur"
      );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        {isAdmin && <CreateUserDialog />}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des utilisateurs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className=" bg-white/5 rounded-b-sm">
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nom}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(value) => updateUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="employe">Collaborateur</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteUser(user.id)}
                    className="bg-red-500/50 hover:!bg-red-500 cursor-pointer"
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
