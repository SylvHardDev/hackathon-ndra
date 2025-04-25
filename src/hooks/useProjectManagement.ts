import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Project {
  id: number;
  title: string;
  description: string;
  type: "design" | "video";
  status: string;
}

export function useProjectManagement() {
  const [isLoading, setIsLoading] = useState(false);

  const createProject = async (projectData: Omit<Project, "id" | "status">) => {
    setIsLoading(true);
    try {
      // Création du projet
      const { data: project, error: projectError } = await supabase
        .from("project")
        .insert([
          {
            ...projectData,
            status: "open",
          },
        ])
        .select("id")
        .single();

      if (projectError || !project) throw projectError;

      // Assignation de l'utilisateur courant au projet
      const { error: assignError } = await supabase
        .from("project_account")
        .insert([
          {
            project_id: project.id,
          },
        ]);

      if (assignError) throw assignError;

      toast.success("Le projet a été créé avec succès");
      return project;
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      toast.error("Une erreur est survenue lors de la création du projet");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (projectId: number) => {
    setIsLoading(true);
    try {
      // Suppression des assignations d'utilisateurs
      const { error: assignError } = await supabase
        .from("project_account")
        .delete()
        .eq("project_id", projectId);

      if (assignError) throw assignError;

      // Suppression du projet
      const { error: projectError } = await supabase
        .from("project")
        .delete()
        .eq("id", projectId);

      if (projectError) throw projectError;

      toast.success("Le projet a été supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du projet:", error);
      toast.error("Une erreur est survenue lors de la suppression du projet");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createProject,
    deleteProject,
  };
}
