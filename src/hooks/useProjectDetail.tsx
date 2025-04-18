import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Projet } from "@/pages/dashboard/Projects/ProjectListView";

export function useProjectDetail(projectId: number) {
  const [project, setProject] = useState<Projet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from("project")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updates: Partial<Projet>) => {
    try {
      const { data, error } = await supabase
        .from("project")
        .update(updates)
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProject(data);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return null;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  return {
    project,
    loading,
    error,
    updateProject,
    refreshProject: fetchProject,
  };
}
