import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  activeProjects: number;
  projectsPerMonth: Array<{ name: string; value: number }>;
  recentActivity: Array<{
    id: number;
    user: string;
    action: string;
    project: string;
    time: string;
  }>;
  upcomingDeadlines: Array<{
    id: number;
    title: string;
    dueDate: string;
    priority: "high" | "medium" | "low";
  }>;
  teamPerformance: Array<{
    id: number;
    name: string;
    percentage: number;
  }>;
  projectStatus: Array<{
    id: number;
    title: string;
    status: string;
    statusText: string; 
    percentage: number;
  }>;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    projectsPerMonth: [],
    recentActivity: [],
    upcomingDeadlines: [],
    teamPerformance: [],
    projectStatus: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer le nombre total d'utilisateurs
      const { data: userData, error: userError } = await supabase
        .from("accounts")
        .select("id", { count: "exact" });
      
      if (userError) throw userError;
      
      // Récupérer les projets
      const { data: projectsData, error: projectsError } = await supabase
        .from("project")
        .select("*");
      
      if (projectsError) throw projectsError;
      
      // Calculer les projets actifs (ceux qui ne sont pas 'closed')
      const activeProjects = projectsData?.filter(p => p.status !== 'closed')?.length || 0;

      // Récupérer les projets par mois
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentDate = new Date();
      const projectsPerMonth: Array<{ name: string; value: number }> = [];
      
      // Préparer les données pour les 6 derniers mois
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentDate.getMonth() - i + 12) % 12;
        const year = currentDate.getFullYear() - (currentDate.getMonth() < i ? 1 : 0);
        
        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0);
        
        const projectsInMonth = projectsData?.filter(p => {
          const createdAt = new Date(p.created_at);
          return createdAt >= startDate && createdAt <= endDate;
        })?.length || 0;
        
        projectsPerMonth.push({
          name: monthNames[monthIndex],
          value: projectsInMonth
        });
      }

      // Pour l'activité récente, utiliser les projets récents au lieu de project_history
      // qui semble ne pas exister dans la base de données
      const recentActivity = projectsData
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        ?.slice(0, 3)
        ?.map((project, index) => {
          const createdAt = new Date(project.created_at);
          const now = new Date();
          const diffInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));
          
          return {
            id: index + 1,
            user: "Utilisateur",
            action: "a créé un nouveau projet",
            project: project.title,
            time: `${diffInHours} heures`
          };
        }) || [];

      // Simuler les données pour les délais à venir (à remplacer par des données réelles)
      const upcomingDeadlines = [
        {
          id: 1,
          title: "Lancement du site web",
          dueDate: "3 jours",
          priority: "high" as const
        },
        {
          id: 2,
          title: "Réunion client",
          dueDate: "Demain",
          priority: "medium" as const
        },
        {
          id: 3,
          title: "Revue de projet",
          dueDate: "Semaine prochaine",
          priority: "low" as const
        }
      ];

      // Simuler les performances d'équipe (à remplacer par des données réelles)
      const teamPerformance = [
        {
          id: 1,
          name: "Équipe Développement",
          percentage: 92
        },
        {
          id: 2,
          name: "Équipe Design",
          percentage: 87
        },
        {
          id: 3,
          name: "Équipe Marketing",
          percentage: 78
        }
      ];

      // Récupérer le statut des projets
      const projectStatus = projectsData?.slice(0, 3).map(project => {
        // Mapper le statut vers un texte et un indicateur visuel
        let statusText = "";
        let status = "";
        let percentage = 0;
        
        switch (project.status) {
          case "open":
            statusText = "En planification";
            status = "blue";
            percentage = 20;
            break;
          case "in_realisation":
            statusText = "En cours";
            status = "green";
            percentage = 45;
            break;
          case "in_validation":
            statusText = "En validation";
            status = "yellow";
            percentage = 75;
            break;
          case "validate":
            statusText = "Validé";
            status = "green";
            percentage = 85;
            break;
          case "need_revision":
            statusText = "Besoin de révision";
            status = "yellow";
            percentage = 65;
            break;
          case "closed":
            statusText = "Terminé";
            status = "green";
            percentage = 100;
            break;
          default:
            statusText = "Inconnu";
            status = "gray";
            percentage = 0;
        }
        
        return {
          id: project.id,
          title: project.title,
          status,
          statusText,
          percentage
        };
      }) || [];

      setStats({
        totalUsers: userData?.length || 0,
        totalProjects: projectsData?.length || 0,
        activeProjects,
        projectsPerMonth,
        recentActivity,
        upcomingDeadlines,
        teamPerformance,
        projectStatus
      });
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Mettre en place des abonnements en temps réel pour les mises à jour
    const projectsChannel = supabase
      .channel('dashboard_projects_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'project' }, 
        () => fetchStats()
      )
      .subscribe();
      
    const usersChannel = supabase
      .channel('dashboard_users_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'accounts' }, 
        () => fetchStats()
      )
      .subscribe();
      
    // Suppression de l'abonnement à project_history qui ne semble pas exister

    return () => {
      projectsChannel.unsubscribe();
      usersChannel.unsubscribe();
    };
  }, []);

  return { stats, loading, error, refreshStats: fetchStats };
} 