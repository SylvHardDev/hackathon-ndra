import { useState } from "react";
import { useProjectAssignments } from "./useProjectAssignments";
import { toast } from "sonner";

export function useAssignUsersToProject(projectId: number) {
  const [submitting, setSubmitting] = useState(false);
  const { assignedIds, updateAssignments } = useProjectAssignments(projectId);

  const handleAssignUsers = async (selectedUsers: number[]) => {
    if (selectedUsers.length === 0) return;

    setSubmitting(true);

    try {
      // Filtrer les IDs non définis ou invalides
      const validSelectedUsers = selectedUsers.filter(
        (id) => typeof id === "number" && !isNaN(id)
      );

      if (validSelectedUsers.length === 0) {
        throw new Error("Aucun utilisateur valide à assigner");
      }

      // Créer un nouvel ensemble d'IDs d'utilisateurs assignés
      // en combinant les utilisateurs déjà assignés avec les nouveaux
      const newAssignedIds = [...new Set([...assignedIds, ...validSelectedUsers])];

      // Mettre à jour toutes les assignations en une seule opération
      await updateAssignments(newAssignedIds);

      // Notification de succès
      toast.success(
        `${validSelectedUsers.length} utilisateur(s) assigné(s) au projet avec succès`
      );

      return true;
    } catch (err) {
      console.error("Erreur d'assignation:", err);
      toast.error("Erreur lors de l'assignation des utilisateurs");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleAssignUsers,
  };
} 