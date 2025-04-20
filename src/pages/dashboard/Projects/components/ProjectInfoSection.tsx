import { Card, CardContent } from "@/components/ui/card";
import { useProjectAssignments } from "@/hooks/useProjectAssignments";
import { useRole } from "@/hooks/useRole";
import { Calendar, FileText, Loader2 } from "lucide-react";
import AssignUsersDialog from "../AssignUsersDialog";
import RemoveUserDialog from "../RemoveUserDialog";

interface ProjectInfoSectionProps {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  projectCreatedAt: string;
  isEditing: boolean;
  editedTitle: string;
  editedDescription: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function ProjectInfoSection({
  projectId,
  projectType,
  projectCreatedAt,
}: ProjectInfoSectionProps) {
  const { isAdmin } = useRole();
  const {
    allAccounts,
    assignedIds,
    loading: assignmentsLoading,
    updateAssignments,
  } = useProjectAssignments(projectId);
  const assignedUsers = allAccounts.filter((acct) =>
    assignedIds.includes(acct.id)
  );

  return (
    <Card>
      <CardContent className="p-6 flex justify-between">
        <div>
          <div className="flex justify-between items-center mb-4 gap-10">
            <h3 className="text-lg font-semibold">Utilisateurs assignés</h3>
            {isAdmin && (
              <div>
                <AssignUsersDialog projectId={projectId} />
              </div>
            )}
          </div>
          {assignmentsLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {assignedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50/5 rounded"
                >
                  <div>
                    <p className="font-medium">{user.nom}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                  {isAdmin && (
                    <RemoveUserDialog
                      projectId={projectId}
                      userId={user.id}
                      userName={user.nom}
                      onSuccess={() => updateAssignments(assignedIds)}
                    />
                  )}
                </div>
              ))}
              {assignedUsers.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Aucun utilisateur assigné
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Date de création</p>
              <p className="font-medium">
                {new Date(projectCreatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{projectType}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
