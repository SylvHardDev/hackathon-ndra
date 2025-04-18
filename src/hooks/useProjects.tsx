import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type ProjectType = "design" | "video";
export type ProjectStatus =
  | "open"
  | "in_realisation"
  | "in_validation"
  | "validate"
  | "need_revision"
  | "closed";

export interface Project {
  id: number;
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  created_by: number;
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
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

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
      if (data) {
        setProjects((prev) => [data, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return null;
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
      if (data) {
        setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return null;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const { error } = await supabase.from("project").delete().eq("id", id);

      if (error) throw error;
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}
