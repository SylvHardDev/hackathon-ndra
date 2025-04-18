import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ProjectComment {
  id: number;
  project_id: number;
  author_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
}

export function useProjectComments(projectId: number) {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("project_comment")
        .select(
          `
          *,
          author:accounts (
            id,
            email,
            full_name
          )
        `
        )
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (
    content: string,
    parentId: number | null = null
  ) => {
    try {
      const { data, error } = await supabase
        .from("project_comment")
        .insert([
          {
            project_id: projectId,
            content,
            parent_id: parentId,
          },
        ])
        .select(
          `
          *,
          author:accounts (
            id,
            email,
            full_name
          )
        `
        )
        .single();

      if (error) throw error;
      if (data) {
        setComments((prev) => [...prev, data]);
      }
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return null;
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const { error } = await supabase
        .from("project_comment")
        .delete()
        .eq("id", commentId);

      if (error) throw error;
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      return false;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchComments();
    }
  }, [projectId]);

  return {
    comments,
    loading,
    error,
    addComment,
    deleteComment,
    refreshComments: fetchComments,
  };
}
