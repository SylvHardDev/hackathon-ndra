import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Projet } from "./ProjectListView";

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
        <Link to={`/projects/${project.id}`}>
          <h4 className="font-medium mb-2">{project.title}</h4>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{project.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(project.created_at).toLocaleDateString()}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-sm bg-gray-100/2">
            {project.type}
          </span>
        </div>
      </Card>
    </div>
  );
}
