import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useProjectAssignments } from "@/hooks/useProjectAssignments";
import { toast } from "sonner";

interface RemoveUserDialogProps {
  projectId: number;
  userId: number;
  userName: string;
}

export default function RemoveUserDialog({
  projectId,
  userId,
  userName,
}: RemoveUserDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateAssignments, assignedIds } = useProjectAssignments(projectId);

  const handleRemoveUser = async () => {
    try {
      // Créer une nouvelle liste sans l'utilisateur à supprimer
      const newAssignedIds = assignedIds.filter((id) => id !== userId);

      // Mettre à jour les assignations
      await updateAssignments(newAssignedIds);

      toast.success(`${userName} a été retiré du projet`);
      setOpen(false);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Retirer l'utilisateur"
        description={`Êtes-vous sûr de vouloir retirer ${userName} de ce projet ?`}
        onConfirm={handleRemoveUser}
        confirmText="Retirer"
      />
    </>
  );
}
