import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Account {
  id: number;
  nom: string;
  role: string;
}

export function useProjectAssignments(projectId: number) {
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [assignedIds, setAssignedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charge tous les comptes
  const fetchAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('accounts')
        .select('id, nom, role')
        .order('nom', { ascending: true });
      
      if (error) throw error;
      if (data) setAllAccounts(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des comptes:', err);
      setError((err as Error).message);
    }
  };

  // Charge les affectations pour ce projet
  const fetchAssigned = async () => {
    try {
      const { data, error } = await supabase
        .from('project_account')
        .select('account_id')
        .eq('project_id', projectId);
      
      if (error) throw error;
      if (data) setAssignedIds(data.map((r) => r.account_id));
    } catch (err) {
      console.error('Erreur lors de la récupération des assignations:', err);
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchAccounts(), fetchAssigned()]);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId]);

  // Assignation multiple : on passe la nouvelle liste d'IDs
  const updateAssignments = async (newIds: number[]) => {
    setLoading(true);
    setError(null);
    try {
      // 1) Supprime tout
      const { error: deleteError } = await supabase
        .from('project_account')
        .delete()
        .eq('project_id', projectId);
      
      if (deleteError) throw deleteError;

      // 2) (Ré)insère
      if (newIds.length) {
        const { error: insertError } = await supabase
          .from('project_account')
          .insert(newIds.map((id) => ({ project_id: projectId, account_id: id })));
        
        if (insertError) throw insertError;
      }

      setAssignedIds(newIds);
    } catch (err) {
      console.error('Erreur lors de la mise à jour des assignations:', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { allAccounts, assignedIds, updateAssignments, loading, error };
}
