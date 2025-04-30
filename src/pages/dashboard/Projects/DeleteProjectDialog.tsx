import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";

interface DeleteProjectDialogProps {
  projectId: number;
  projectName: string;
}

export default function DeleteProjectDialog({
  projectId,
  projectName,
}: DeleteProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { deleteProject, refreshProjects } = useProjects();

  const handleDeleteProject = async () => {
    try {
      const success = await deleteProject(projectId);
      if (success) {
        await refreshProjects();
        toast.success("Projet supprimé avec succès");
        navigate("/projects");
      } else {
        throw new Error("Échec de la suppression du projet");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      toast.error("Erreur lors de la suppression du projet");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Supprimer le projet"
        description={`Êtes-vous sûr de vouloir supprimer le projet "${projectName}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteProject}
        confirmText="Supprimer"
      />
    </>
  );
}
