// src/hooks/useMyAssignedProjectIds.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import useAuth from "@/hooks/useAuth";
import { Check, Loader2, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProjectAssignments } from "@/hooks/useProjectAssignments";
import { useAssignUser } from "@/hooks/useAssignUser";
import { useAssignUsersToProject } from "@/hooks/useAssignUsersToProject";

export function useMyAssignedProjectIds() {
  const { user } = useAuth();
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user) {
        setAssignedIds([]);
        setLoading(false);
        return;
      }

      try {
        // 1) Récupérer l'ID numérique de la table accounts
        const { data: acc, error: accErr } = await supabase
          .from("accounts")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (accErr || !acc) throw accErr ?? new Error("Compte introuvable");

        // 2) Requête sur project_account avec account_id = acc.id
        const { data, error: paErr } = await supabase
          .from("project_account")
          .select("project_id")
          .eq("account_id", acc.id);

        if (paErr) throw paErr;

        setAssignedIds(data?.map((r) => r.project_id) || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchAssignments();
  }, [user]);

  return { assignedIds, loading, error };
}

// Ajouter le composant AssignUsersDialog
interface AssignUsersDialogProps {
  projectId: number;
}

export default function AssignUsersDialog({
  projectId,
}: AssignUsersDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { assignedIds } = useProjectAssignments(projectId);
  const { users, loadingUsers, errorMessage, fetchUsers, filterUsers } =
    useAssignUser();
  const { submitting, handleAssignUsers } = useAssignUsersToProject(projectId);

  // Gérer la sélection d'un utilisateur
  const handleToggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Assigner les utilisateurs sélectionnés au projet
  const handleSubmit = async () => {
    const success = await handleAssignUsers(selectedUsers);
    if (success) {
      setOpen(false);
      setSelectedUsers([]);
      setSearchQuery("");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (newOpen) {
          fetchUsers();
        } else {
          setSelectedUsers([]);
          setSearchQuery("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Assigner des utilisateurs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Assigner des utilisateurs au projet</DialogTitle>
        </DialogHeader>

        {/* Barre de recherche */}
        <div className="flex items-center space-x-2 my-2">
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

        {/* Affichage des sélections */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center space-x-2 my-2">
            <div className="text-sm text-gray-500">Sélectionnés:</div>
            <div className="flex flex-wrap gap-1">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u.id === userId);
                return (
                  <Badge
                    key={userId}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {user?.nom || `Utilisateur #${userId}`}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div className="py-2">
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : errorMessage ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
              {errorMessage}
            </div>
          ) : filterUsers(users, searchQuery).length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              {searchQuery
                ? "Aucun résultat trouvé"
                : "Aucun utilisateur disponible"}
            </p>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-1">
                {filterUsers(users, searchQuery).map((user) => {
                  if (!user || typeof user.id !== "number") return null;

                  const isAssigned = assignedIds.includes(user.id);
                  const isSelected = selectedUsers.includes(user.id);

                  return (
                    <div
                      key={user.id}
                      className={`flex items-center space-x-3 p-2 rounded hover:bg-gray-50/5 ${
                        isAssigned ? "opacity-60 bg-gray-100/5" : ""
                      }`}
                    >
                      {!isAssigned && (
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={isSelected}
                          onCheckedChange={() => handleToggleUser(user.id)}
                        />
                      )}

                      {isAssigned && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}

                      <label
                        htmlFor={`user-${user.id}`}
                        className={`flex-1 ${
                          !isAssigned ? "cursor-pointer" : ""
                        }`}
                      >
                        <div className="font-medium">
                          {user.nom || "Sans nom"}
                        </div>
                        {user.role && (
                          <div className="text-xs text-gray-400">
                            {user.role === "admin"
                              ? "Administrateur"
                              : user.role === "employe"
                              ? "Collaborateur"
                              : user.role === "client"
                              ? "Client"
                              : user.role}
                          </div>
                        )}
                      </label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedUsers.length === 0 || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              `Assigner ${selectedUsers.length} utilisateur${
                selectedUsers.length > 1 ? "s" : ""
              }`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
