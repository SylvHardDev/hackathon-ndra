// src/hooks/useCommentNotifications.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CommentRead {
  last_read: string;
}

export function useCommentNotifications(projectId: number) {
  const [unreadChat, setUnreadChat] = useState<number>(0);
  const [unreadVideo, setUnreadVideo] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchCounts = async () => {
      setLoading(true);
      try {
        // 1) get numeric account_id
        const { data: userData } = await supabase.auth.getUser();
        const uuid = userData.user?.id;
        if (!uuid) { setLoading(false); return; }
        
        const { data: acc } = await supabase
          .from('accounts')
          .select('id')
          .eq('user_id', uuid)
          .single();
        const accountId = acc?.id;
        if (!accountId) { setLoading(false); return; }

        // 2) fetch last_read timestamps
        const { data: chatRead } = await supabase
          .from('project_comment_read')
          .select('last_read')
          .eq('project_id', projectId)
          .eq('account_id', accountId)
          .single();

        const { data: videoRead } = await supabase
          .from('video_comment_read')
          .select('last_read')
          .eq('project_id', projectId)
          .eq('account_id', accountId)
          .single();

        const lastChatRead = chatRead?.last_read ?? '1970-01-01T00:00:00Z';
        const lastVideoRead = videoRead?.last_read ?? '1970-01-01T00:00:00Z';

        // 3) fetch unread chat
        const { count: chatCount } = await supabase
          .from('project_comment')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', projectId)
          .eq('is_deleted', false)
          .gt('created_at', lastChatRead);
        
        // 4) fetch unread video
        const { count: videoCount } = await supabase
          .from('video_comments')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', projectId)
          .eq('is_deleted', false)
          .gt('created_at', lastVideoRead);

        setUnreadChat(chatCount || 0);
        setUnreadVideo(videoCount || 0);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();

    // Abonnement realtime pour rafraîchir automatiquement
    const chatChannel = supabase
      .channel(`notif_chat_${projectId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'project_comment', 
          filter: `project_id=eq.${projectId}` 
        },
        () => fetchCounts()
      )
      .subscribe();

    const videoChannel = supabase
      .channel(`notif_video_${projectId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'video_comments', 
          filter: `project_id=eq.${projectId}` 
        },
        () => fetchCounts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(videoChannel);
    };
  }, [projectId]);

  return { unreadChat, unreadVideo, loading };
}
