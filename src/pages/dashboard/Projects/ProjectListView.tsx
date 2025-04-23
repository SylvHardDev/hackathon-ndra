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
import { useMyAssignedProjectIds } from "@/hooks/useMyAssignedProjectIds";
import { useRole } from "@/hooks/useRole";
import { toast } from "sonner";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card } from "@/components/ui/card";
import { SortableCard } from "./SortableCard";
import { Calendar, Video, Paintbrush } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProjectUsers } from "@/hooks/useProjectUsers";

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
  description: string;
}

interface ProjectUser {
  project_id: number;
  account_id: number;
  account: {
    id: number;
    nom: string;
    role: string;
  };
}

interface ProjectListViewProps {
  searchQuery: string;
  statusFilter: string;
}

type ProjectStatus =
  | "open"
  | "in_realisation"
  | "in_validation"
  | "validate"
  | "need_revision"
  | "closed";
type UserRole = "admin" | "employee" | "client";

// Définition des transitions autorisées par rôle
const ALLOWED_TRANSITIONS: Record<
  UserRole,
  Partial<Record<ProjectStatus, ProjectStatus[]>>
> = {
  admin: {
    validate: ["closed"],
    closed: ["open"],
  },
  employee: {
    in_validation: ["in_realisation"],
    in_realisation: ["in_validation"],
  },
  client: {
    need_revision: ["validate"],
    validate: ["need_revision", "validate"],
  },
};

// Définition des statuts accessibles par rôle
const ROLE_STATUSES: Record<UserRole, ProjectStatus[]> = {
  admin: ["open", "closed"],
  employee: ["open", "in_realisation", "in_validation", "need_revision"],
  client: ["in_validation", "need_revision", "validate"],
};

// Définition du flux de changement de statut
const STATUS_FLOW: Record<ProjectStatus, ProjectStatus[]> = {
  open: ["in_realisation"],
  in_realisation: ["in_validation"],
  in_validation: ["need_revision", "in_realisation", "validate"],
  need_revision: ["in_realisation", "validate"],
  validate: ["need_revision", "closed"],
  closed: ["open"],
};

const statusColumns = [
  { id: "open", title: "Ouvert" },
  { id: "in_realisation", title: "En réalisation" },
  { id: "in_validation", title: "En validation" },
  { id: "need_revision", title: "Révision nécessaire" },
  { id: "validate", title: "Validé" },
  { id: "closed", title: "Fermé" },
] as const;

const KanbanColumn = ({
  id,
  title,
  children,
  isOver = false,
  isAllowed = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  isOver?: boolean;
  isAllowed?: boolean;
}) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  // Définition des couleurs pour chaque statut
  const statusColors: Record<string, { bg: string; text: string }> = {
    open: {
      bg: "rgba(100, 5, 100, 0.8)",
      text: "#f2f2f2",
    },
    in_realisation: {
      bg: "rgba(38, 132, 255, 0.8)",
      text: "#f2f2f2",
    },
    in_validation: {
      bg: "rgba(255, 171, 0, 0.8)",
      text: "#f2f2f2",
    },
    need_revision: {
      bg: "rgba(255, 86, 48, 0.8)",
      text: "#f2f2f2",
    },
    validate: {
      bg: "rgba(0, 200, 0, 0.8)",
      text: "#f2f2f2",
    },
    closed: {
      bg: "rgba(0, 245, 0, 0.8)",
      text: "#f2f2f2",
    },
  };

  return (
    <div
      ref={setNodeRef}
      className={`space-y-4 p-2 border-r border-gray-200/10 h-full ${
        isOver
          ? isAllowed
            ? "rounded-lg bg-green-50/5 border border-green-500"
            : "rounded-lg bg-red-50/5 border border-red-500"
          : ""
      }`}
    >
      <h3
        className={`text-sm font-semibold mb-2 p-2 rounded-md`}
        style={{
          backgroundColor: statusColors[id].bg,
          color: statusColors[id].text,
        }}
      >
        {title}
      </h3>
      <div className="space-y-1 min-h-[100px] h-full">{children}</div>
    </div>
  );
};

interface UserAvatarProps {
  name: string;
  className?: string;
}

const UserAvatar = ({ name, className = "" }: UserAvatarProps) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium ${className}`}
    >
      {initials}
    </div>
  );
};

const ProjectUsers = ({ projectId }: { projectId: number }) => {
  const { users, loading } = useProjectUsers(projectId);

  if (loading)
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;

  console.log("Users data:", users);

  return (
    <div className="flex -space-x-2">
      {users.map((user, index) => {
        console.log("User account:", user.account);
        console.log("User nom:", user.account.nom);
        return (
          <TooltipProvider key={user.account.id}>
            <Tooltip>
              <TooltipTrigger>
                <UserAvatar
                  name={user.account.nom}
                  className={`border-2 border-background ${
                    index > 0 ? "-ml-2" : ""
                  }`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.account.nom}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default function ProjectListView({
  searchQuery,
  statusFilter,
}: ProjectListViewProps) {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const { projects, loading: projectsLoading, updateProject } = useProjects();
  const { assignedIds, loading: assignmentsLoading } =
    useMyAssignedProjectIds();
  const { isAdmin } = useRole();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [activeId, setActiveId] = useState<number | null>(null);
  const [currentDragStatus, setCurrentDragStatus] = useState<{
    isOver: boolean;
    isAllowed: boolean;
    targetColumn: Projet["status"];
  } | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 5,
      },
    })
  );

  // Filtrer les projets selon le rôle, la recherche et le statut
  const filteredProjects = (
    isAdmin
      ? projects // L'admin voit tous les projets
      : projects.filter((project) => assignedIds.includes(project.id))
  ) // Les autres utilisateurs ne voient que leurs projets assignés
    .filter(
      (project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (project) => statusFilter === "all" || project.status === statusFilter
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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeProject = projects.find((p) => p.id === active.id);
    const newStatus = over.id as ProjectStatus;

    if (!activeProject || activeProject.status === newStatus) return;

    const userRole = isAdmin ? "admin" : ("employee" as UserRole);
    const allowedStatuses = ROLE_STATUSES[userRole];
    const isStatusAllowed = allowedStatuses.includes(newStatus);
    const allowedTransitions = STATUS_FLOW[activeProject.status];
    const isFlowRespected = allowedTransitions.includes(newStatus);

    setCurrentDragStatus({
      isOver: true,
      isAllowed: isStatusAllowed && isFlowRespected,
      targetColumn: newStatus,
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setCurrentDragStatus(null);
      return;
    }

    const activeProject = projects.find((p) => p.id === active.id);
    const newStatus = over.id as ProjectStatus;

    if (!activeProject || activeProject.status === newStatus) {
      setCurrentDragStatus(null);
      setActiveId(null);
      return;
    }

    const userRole = isAdmin ? "admin" : ("employee" as UserRole);
    const allowedStatuses = ROLE_STATUSES[userRole];
    const isStatusAllowed = allowedStatuses.includes(newStatus);

    if (!isStatusAllowed) {
      toast.error("Votre rôle ne permet pas ce changement de statut");
      setCurrentDragStatus(null);
      setActiveId(null);
      return;
    }

    const allowedTransitions = STATUS_FLOW[activeProject.status];
    const isFlowRespected = allowedTransitions.includes(newStatus);

    if (!isFlowRespected) {
      toast.error("Le changement de statut ne respecte pas le flux");
      setCurrentDragStatus(null);
      setActiveId(null);
      return;
    }

    try {
      await updateProject(activeProject.id, { status: newStatus });
      toast.success("Statut du projet mis à jour avec succès");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }

    setCurrentDragStatus(null);
    setActiveId(null);
  };

  if (projectsLoading || (!isAdmin && assignmentsLoading)) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
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
                  Assignés
                </TableHead>
                <TableHead className="w-[150px] font-semibold">
                  Date de création
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow
                  key={project.id}
                  className="hover:bg-gray-50/2"
                  onMouseEnter={() => setSelectedProjectId(project.id)}
                >
                  <TableCell className="font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            to={`/projects/${project.id}`}
                            className="hover:underline"
                          >
                            {project.title}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{project.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                    <div className="flex items-center gap-2">
                      {project.type === "video" ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <Paintbrush className="h-4 w-4" />
                      )}
                      <span className="px-3 py-2 text-xs font-medium rounded-sm bg-gray-100/2">
                        {project.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ProjectUsers projectId={project.id} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {viewMode === "kanban" && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-6 gap-2 min-h-[70vh]">
            {statusColumns.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                title={column.title}
                isOver={
                  currentDragStatus?.isOver &&
                  currentDragStatus.targetColumn === column.id
                }
                isAllowed={currentDragStatus?.isAllowed || false}
              >
                <SortableContext
                  items={filteredProjects
                    .filter((project) => project.status === column.id)
                    .map((project) => project.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredProjects
                    .filter((project) => project.status === column.id)
                    .map((project) => (
                      <SortableCard key={project.id} project={project} />
                    ))}
                </SortableContext>
              </KanbanColumn>
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <Card className="p-4 shadow-lg">
                <h4 className="font-medium mb-1">
                  {projects.find((p) => p.id === activeId)?.title}
                </h4>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
