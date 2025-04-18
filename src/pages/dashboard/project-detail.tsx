import { useParams } from "react-router-dom";
import ProjectDetail from "./Projects/ProjectDetail";
import { Projet } from "./Projects/ProjectListView";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { Skeleton } from "@/components/ui/skeleton";

// Exemple de données simulées pour le développement
const dummyProject: Projet = {
  id: 1,
  title: "Projet Alpha",
  status: "open",
  type: "video",
  created_at: new Date().toISOString(),
};

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
