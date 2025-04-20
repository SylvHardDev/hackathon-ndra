import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ProjectMedia {
  id: number;
  project_id: number;
  url: string;
  media_type: 'video' | 'image';
  created_at: string;
}

export function useProjectMedia(projectId: number) {
  const [media, setMedia] = useState<ProjectMedia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch media list
  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('project_media')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setMedia(data || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur de chargement des médias';
      console.error('fetchMedia error:', err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Initialize fetch
  useEffect(() => {
    if (!projectId) return;
    fetchMedia();
  }, [projectId, fetchMedia]);

  // Upload a media file
  const uploadMedia = useCallback(
    async (file: File, projectType: 'video' | 'design') => {
      setError(null);
      try {
        // Validate file type
        const mainType = file.type.split('/')[0];
        if (projectType === 'video' && mainType !== 'video') {
          throw new Error('Seuls les fichiers vidéo sont autorisés.');
        }
        if (projectType === 'design' && mainType !== 'image') {
          throw new Error('Seules les images sont autorisées.');
        }

        // Prepare file path
        // const ext = file.name.split('.').pop();
        const safeName = file.name.replace(/\s+/g, '_');
        const path = `project_${projectId}/${Date.now()}_${safeName}`;
        const bucket = 'project-media';  // assure-toi que le bucket existe sous ce nom

        // Upload to storage
        console.log('Uploading to', bucket, 'path', path);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        console.log('UploadData:', uploadData);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(uploadData.path);
        const publicUrl = urlData.publicUrl;
        console.log('Public URL:', publicUrl);

        // Insert record in DB
        const { data: mediaData, error: dbError } = await supabase
          .from('project_media')
          .insert([{ project_id: projectId, url: publicUrl, media_type: projectType }])
          .select()
          .single();
        if (dbError) throw dbError;

        setMedia(prev => [mediaData, ...prev]);
        toast.success('Upload réussi');
        return mediaData;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
        console.error('uploadMedia error:', err);
        setError(msg);
        toast.error(msg);
        throw err;
      }
    },
    [projectId]
  );

  // Delete media
  const deleteMedia = useCallback(
    async (mediaId: number) => {
      setError(null);
      try {
        const toDelete = media.find(m => m.id === mediaId);
        if (!toDelete) throw new Error('Média non trouvé');

        const fileName = toDelete.url.split('/').pop();
        if (!fileName) throw new Error('Nom de fichier invalide');

        // Remove from storage
        const bucket = 'project_media';
        const { error: storageError } = await supabase.storage
          .from(bucket)
          .remove([fileName]);
        if (storageError) throw storageError;

        // Remove from database
        const { error: dbError } = await supabase
          .from('project_media')
          .delete()
          .eq('id', mediaId);
        if (dbError) throw dbError;

        setMedia(prev => prev.filter(m => m.id !== mediaId));
        toast.success('Média supprimé');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur lors de la suppression';
        console.error('deleteMedia error:', err);
        setError(msg);
        toast.error(msg);
        throw err;
      }
    },
    [media]
  );

  return { media, loading, error, uploadMedia, deleteMedia };
}
