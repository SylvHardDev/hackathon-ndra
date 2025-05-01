import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Users, Briefcase, Clock, TrendingUp, Loader2 } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
        </div>
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Afficher un message d'erreur
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-red-500">
            Erreur lors du chargement des données: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre tableau de bord
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Total des utilisateurs sur la plateforme
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projets actifs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projets en cours de réalisation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projets totaux
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Nombre total de projets
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projets / mois
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.projectsPerMonth.length > 0
                ? stats.projectsPerMonth[stats.projectsPerMonth.length - 1]
                    .value
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Projets créés ce mois-ci
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aperçu mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.projectsPerMonth}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="value"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} dans {activity.project}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Il y a {activity.time}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune activité récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Délais à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.upcomingDeadlines.map((deadline) => (
                <div
                  key={deadline.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{deadline.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Dans {deadline.dueDate}
                    </p>
                  </div>
                  <span
                    className={`text-sm ${
                      deadline.priority === "high"
                        ? "text-yellow-500 dark:text-yellow-400"
                        : deadline.priority === "medium"
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-green-500 dark:text-green-400"
                    }`}
                  >
                    {deadline.priority === "high"
                      ? "Haute priorité"
                      : deadline.priority === "medium"
                      ? "Priorité moyenne"
                      : "Faible priorité"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance d'équipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.teamPerformance.map((team) => (
                <div key={team.id}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{team.name}</p>
                    <span className="text-sm font-medium">
                      {team.percentage}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${team.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statut des projets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.projectStatus.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{project.title}</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          project.status === "green"
                            ? "bg-green-500"
                            : project.status === "yellow"
                            ? "bg-yellow-500"
                            : project.status === "blue"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <p className="text-sm text-muted-foreground">
                        {project.statusText}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{project.percentage}%</p>
                </div>
              ))}
              {stats.projectStatus.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucun projet en cours
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
