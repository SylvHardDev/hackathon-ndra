import { useParams } from "react-router-dom";
import ProjectDetail from "./Projects/ProjectDetail";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { project, loading } = useProjectDetail(Number(id));

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!project) {
    return <div>Projet non trouvé</div>;
  }

  return <ProjectDetail project={project} />;
}
