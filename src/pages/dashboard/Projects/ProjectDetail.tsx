import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectStatusDot from "./ProjectStatusDot";
import { MessageCircle, Pencil, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Projet } from "./ProjectListView";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { useRole } from "@/hooks/useRole";
import DeleteProjectDialog from "./DeleteProjectDialog";
import { toast } from "sonner";
import { ProjectInfoSection } from "./components/ProjectInfoSection";
import { ProjectMediaSection } from "./components/ProjectMediaSection";
import { ActivitySidebar } from "./components/ActivitySidebar";
import { Card } from "@/components/ui/card";

interface ProjectDetailProps {
  project: Projet;
}

export default function ProjectDetail({
  project: initialProject,
}: ProjectDetailProps) {
  const [showActivity, setShowActivity] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initialProject.title);
  const [editedDescription, setEditedDescription] = useState(
    initialProject.description || ""
  );

  const { isAdmin } = useRole();
  const { project, loading, updateProject } = useProjectDetail(
    initialProject.id
  );

  const handleStatusChange = async (newStatus: Projet["status"]) => {
    try {
      await updateProject({ status: newStatus });
      toast.success("Statut du projet mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleSaveChanges = async () => {
    try {
      await updateProject({
        title: editedTitle,
        description: editedDescription,
      });
      setIsEditing(false);
      toast.success("Projet mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du projet:", error);
      toast.error("Erreur lors de la mise à jour du projet");
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

  const currentProject = project || initialProject;

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex">
        {/* Main Content */}
        <div
          className={cn(
            "flex-1 flex flex-col gap-6",
            showActivity ? "mr-[400px]" : ""
          )}
        >
          <Card className="p-6 relative">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-bold"
                  />
                  <Input
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Description du projet"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      {currentProject.title}
                    </h1>
                  </div>
                  {currentProject.description && (
                    <p className="text-gray-600 mt-2">
                      {currentProject.description}
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-col items-end gap-4 h-full">
                <div>
                  {isAdmin && (
                    <div className="flex flex-cols items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          isEditing ? handleSaveChanges() : setIsEditing(true)
                        }
                      >
                        {isEditing ? (
                          <Save className="h-4 w-4" />
                        ) : (
                          <Pencil className="h-4 w-4" />
                        )}
                      </Button>
                      <DeleteProjectDialog
                        projectId={currentProject.id}
                        projectName={currentProject.title}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <ProjectStatusDot
                    project={currentProject}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              </div>
            </div>
          </Card>
          <div className="grid gap-6">
            <ProjectInfoSection
              projectId={currentProject.id}
              projectTitle={currentProject.title}
              projectDescription={currentProject.description || ""}
              projectType={currentProject.type}
              projectCreatedAt={currentProject.created_at}
              isEditing={isEditing}
              editedTitle={editedTitle}
              editedDescription={editedDescription}
              onTitleChange={setEditedTitle}
              onDescriptionChange={setEditedDescription}
            />

            <ProjectMediaSection
              projectId={currentProject.id}
              projectType={currentProject.type}
            />
          </div>
        </div>

        <ActivitySidebar
          projectId={currentProject.id}
          showActivity={showActivity}
          onClose={() => setShowActivity(false)}
        />

        {/* Toggle Activity Button */}
        {!showActivity && (
          <Button
            variant="outline"
            size="icon"
            className="fixed p-6 bottom-4 right-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 cursor-pointer"
            onClick={() => setShowActivity(true)}
          >
            <MessageCircle size={24} strokeWidth={1.5} />
          </Button>
        )}
      </div>
    </div>
  );
}
