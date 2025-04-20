import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { supabase } from "@/lib/supabase";

interface RemoveUserDialogProps {
  projectId: number;
  userId: number;
  userName: string;
  onSuccess: () => void;
}

export default function RemoveUserDialog({
  projectId,
  userId,
  userName,
  onSuccess,
}: RemoveUserDialogProps) {
  const [open, setOpen] = useState(false);

  const handleRemoveUser = async () => {
    try {
      const { error } = await supabase
        .from("project_account")
        .delete()
        .eq("project_id", projectId)
        .eq("account_id", userId);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
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
