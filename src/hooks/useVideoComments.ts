import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface VideoComment {
  id: number;
  project_id: number;
  account_id: number;
  timecode: number;
  content: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export function useVideoComments(projectId: number) {
  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);

  // Fetch numeric account_id from accounts table
  useEffect(() => {
    const fetchAccountId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;
        if (!userId) return;

        const { data: acc, error: accError } = await supabase
          .from('accounts')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (accError) throw accError;
        setAccountId(acc.id);
      } catch (err) {
        console.error('Erreur récupération account_id :', err);
        setError((err as Error).message);
      }
    };
    fetchAccountId();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('video_comments')
          .select('*')
          .eq('project_id', projectId)
          .eq('is_deleted', false)
          .order('timecode', { ascending: true });
        if (error) throw error;
        setComments(data || []);
      } catch (err) {
        console.error('Erreur chargement commentaires video :', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchComments();
  }, [projectId]);

  // Add comment (clients only)
  const addComment = async (timecode: number, content: string) => {
    if (accountId == null) {
      throw new Error('Account ID non chargé');
    }
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .insert([
          {
            project_id: projectId,
            timecode,
            content,
            account_id: accountId,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      setComments((prev) => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Erreur ajout commentaire video :', err);
      setError((err as Error).message);
      throw err;
    }
  };

  const updateComment = async (commentId: number, content: string) => {
    try {
      const { data, error } = await supabase
        .from('video_comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .select()
        .single();
      if (error) throw error;
      setComments((prev) => prev.map((c) => (c.id === commentId ? data : c)));
      return data;
    } catch (err) {
      console.error('Erreur mise à jour commentaire video :', err);
      setError((err as Error).message);
      throw err;
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      const { error } = await supabase
        .from('video_comments')
        .update({ is_deleted: true })
        .eq('id', commentId);
      if (error) throw error;
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error('Erreur suppression commentaire video :', err);
      setError((err as Error).message);
      throw err;
    }
  };

  return { comments, loading, error, addComment, updateComment, deleteComment };
}
