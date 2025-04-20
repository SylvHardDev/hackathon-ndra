// src/hooks/useCommentProject.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface ProjectComment {
  id: number;
  project_id: number;
  author_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  author?: {
    id: number;
    nom: string;
  };
}

export function useCommentProject(projectId: number) {
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les commentaires
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('project_comment')
        .select(`
          *,
          author:accounts(id, nom)
        `)
        .eq('project_id', projectId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // Setup initial data et realtime
  useEffect(() => {
    if (!projectId) return;

    setLoading(true);
    fetchComments().finally(() => setLoading(false));

    // Configurer les souscriptions en temps réel
    const channel = supabase
      .channel(`project-comments-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_comment',
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          const { data: newComment, error } = await supabase
            .from('project_comment')
            .select(`
              *,
              author:accounts(id, nom)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && newComment) {
            setComments((prev) => [...prev, newComment]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'project_comment',
          filter: `project_id=eq.${projectId}`,
        },
        async (payload) => {
          const { data: updatedComment, error } = await supabase
            .from('project_comment')
            .select(`
              *,
              author:accounts(id, nom)
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && updatedComment) {
            setComments((prev) =>
              prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
            );
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'project_comment',
          filter: `project_id=eq.${projectId}&is_deleted=eq.true`,
        },
        ({ new: deleted }) => {
          setComments(prev => prev.filter(c => c.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  // 2) Ajouter un nouveau commentaire (chat ou réponse)
  const addComment = async (
    content: string,
    parentId?: number
  ): Promise<ProjectComment> => {
    try {
      const { data, error } = await supabase
        .from('project_comment')
        .insert([
          {
            project_id: projectId,
            author_id: await getNumericAccountId(),
            parent_id: parentId ?? null,
            content,
          },
        ])
        .select(`
          *,
          author:accounts(id, nom)
        `)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Aucune donnée retournée');
      return data as ProjectComment;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // 3) Mettre à jour le contenu d'un commentaire
  const updateComment = async (
    commentId: number,
    content: string
  ): Promise<ProjectComment> => {
    try {
      const { data, error } = await supabase
        .from('project_comment')
        .update({ content })
        .eq('id', commentId)
        .select(`
          *,
          author:accounts(id, nom)
        `)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Aucune donnée retournée');
      return data as ProjectComment;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // 4) Soft-delete d'un commentaire
  const deleteComment = async (commentId: number) => {
    try {
      const { error } = await supabase
        .from('project_comment')
        .update({ is_deleted: true })
        .eq('id', commentId);
      if (error) throw error;
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  // Helper pour récupérer l'ID numérique de accounts
  async function getNumericAccountId(): Promise<number> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.id) throw new Error('Utilisateur non connecté');
    const { data: acc, error } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', user.id)
      .single();
    if (error || !acc) throw error ?? new Error('Compte introuvable');
    return acc.id;
  }

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
  };
}
