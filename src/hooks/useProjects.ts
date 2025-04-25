import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Project {
  id: number;
  title: string;
  description: string;
  type: "design" | "video";
  status: string;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("project")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error("Erreur lors de la récupération des projets:", err);
      setError("Une erreur est survenue lors de la récupération des projets");
      toast.error(
        "Une erreur est survenue lors de la récupération des projets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (
    project: Omit<Project, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const { data, error } = await supabase
        .from("project")
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      setProjects((prev) => [data, ...prev]);
      toast.success("Projet créé avec succès");
      return data;
    } catch (err) {
      console.error("Erreur lors de la création du projet:", err);
      toast.error("Une erreur est survenue lors de la création du projet");
      throw err;
    }
  };

  const updateProject = async (id: number, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from("project")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setProjects((prev) =>
        prev.map((project) => (project.id === id ? data : project))
      );
      toast.success("Projet mis à jour avec succès");
      return data;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du projet:", err);
      toast.error("Une erreur est survenue lors de la mise à jour du projet");
      throw err;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const { error } = await supabase.from("project").delete().eq("id", id);
      if (error) throw error;
      setProjects((prev) => prev.filter((project) => project.id !== id));
      toast.success("Projet supprimé avec succès");
    } catch (err) {
      console.error("Erreur lors de la suppression du projet:", err);
      toast.error("Une erreur est survenue lors de la suppression du projet");
      throw err;
    }
  };

  const refreshProjects = async () => {
    setLoading(true);
    await fetchProjects();
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects,
  };
}
