import { useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectStatusDot from "./ProjectStatusDot";
import { Link } from "react-router-dom";
import { useProjects } from "@/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";

export type ProjectType = "video" | "design";

// Définition d'un type pour un projet
export interface Projet {
  id: number;
  title: string;
  status:
    | "open"
    | "in_realisation"
    | "in_validation"
    | "validate"
    | "need_revision"
    | "closed";
  type: ProjectType;
  created_at: string;
}

export default function ProjectListView() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const { projects, loading, updateProject } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );

  const handleStatusChange = async (
    projectId: number,
    newStatus: Projet["status"]
  ) => {
    try {
      await updateProject(projectId, { status: newStatus });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 ">
        <Tabs
          value={viewMode}
          onValueChange={(val) => setViewMode(val as "list" | "kanban")}
          className="w-full"
        >
          <TabsList className="w-1/3 justify-start">
            <TabsTrigger value="list" className="flex-1">
              Liste
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex-1">
              Kanban
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "list" && (
        <div className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/5">
                <TableHead className="w-[250px] font-semibold">Titre</TableHead>
                <TableHead className="w-[150px] font-semibold">
                  Statut
                </TableHead>
                <TableHead className="w-[150px] font-semibold">Type</TableHead>
                <TableHead className="w-[150px] font-semibold">
                  Date de création
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="hover:bg-gray-50/2"
                  onMouseEnter={() => setSelectedProjectId(project.id)}
                >
                  <TableCell className="font-medium">
                    <Link
                      to={`/projects/${project.id}`}
                      className="hover:underline"
                    >
                      {project.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <ProjectStatusDot
                      project={project}
                      onStatusChange={(newStatus) =>
                        handleStatusChange(project.id, newStatus)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-2 text-xs font-medium rounded-sm bg-gray-100/2">
                      {project.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(project.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {viewMode === "kanban" && (
        <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-lg">
          La vue Kanban sera bientôt disponible.
        </div>
      )}
    </div>
  );
}
