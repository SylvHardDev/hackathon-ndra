import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Projet } from "./ProjectListView";
import { List } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useProjectUsers } from "@/hooks/useProjectUsers";

interface SortableCardProps {
  project: Projet;
}

export function SortableCard({ project }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });
  const { users, loading } = useProjectUsers(project.id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className={`p-4 cursor-move hover:shadow-md transition-shadow gap-2${
          isDragging ? "shadow-lg" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <Link to={`/projects/${project.id}`} className="flex-1">
            <h4 className="font-medium line-clamp-1">{project.title}</h4>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <List className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{project.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">
          {project.description}
        </p>
        <div className="flex -space-x-2">
          {loading ? (
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            users.map((user) => (
              <TooltipProvider key={user.account_id}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium border-2 border-background">
                      {user.account.nom
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{user.account.nom}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          )}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(project.created_at).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-medium rounded-sm bg-gray-100/2">
              {project.type}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
