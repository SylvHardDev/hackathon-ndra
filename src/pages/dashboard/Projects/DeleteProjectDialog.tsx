import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleDeleteProject = async () => {
    try {
      // Supprimer d'abord les relations dans project_account
      const { error: relationError } = await supabase
        .from("project_account")
        .delete()
        .eq("project_id", projectId);

      if (relationError) throw relationError;

      // Puis supprimer le projet
      const { error: projectError } = await supabase
        .from("project")
        .delete()
        .eq("id", projectId);

      if (projectError) throw projectError;

      toast({
        title: "Succès",
        description: "Le projet a été supprimé avec succès.",
      });

      navigate("/projects");
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      toast({
        title: "Erreur",
        description:
          "Une erreur est survenue lors de la suppression du projet.",
        variant: "destructive",
      });
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
