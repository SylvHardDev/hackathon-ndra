import { Card, CardContent } from "@/components/ui/card";
import { useProjectUsers } from "@/hooks/useProjectUsers";
import { useRole } from "@/hooks/useRole";
import { Calendar, FileText, Loader2, User } from "lucide-react";
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
  const { users, loading: usersLoading } = useProjectUsers(projectId);

  const admins = users.filter((user) => user.account.role === "admin");
  const collaborators = users.filter((user) => user.account.role === "employe");
  const clients = users.filter((user) => user.account.role === "client");

  return (
    <Card>
      <CardContent className="p-6 pt-12 relative">
        <div className="grid grid-cols-2 gap-6">
          {isAdmin && (
            <div className="absolute right-6 top-0">
              <AssignUsersDialog projectId={projectId} />
            </div>
          )}

          {/* Section Administrateurs */}
          {isAdmin && (
            <div>
              <div className="flex gap-3 items-center mb-4">
                <User className="text-gray-500" />
                <h3 className="text-lg font-semibold">Administrateurs</h3>
              </div>
              {usersLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {admins.map((user) => (
                    <div
                      key={user.account.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50/5 rounded"
                    >
                      <div>
                        <p className="font-medium">{user.account.nom}</p>
                        <p className="text-sm text-gray-500">
                          {user.account.role}
                        </p>
                      </div>
                      {isAdmin && (
                        <RemoveUserDialog
                          projectId={projectId}
                          userId={user.account.id}
                          userName={user.account.nom}
                        />
                      )}
                    </div>
                  ))}
                  {admins.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      Aucun administrateur assigné
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Section Collaborateurs */}
          <div>
            <div className="flex gap-3 items-center mb-4">
              <User className="text-gray-500" />
              <h3 className="text-lg font-semibold">Collaborateurs</h3>
            </div>
            {usersLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {collaborators.map((user) => (
                  <div
                    key={user.account.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50/5 rounded"
                  >
                    <div>
                      <p className="font-medium">{user.account.nom}</p>
                      <p className="text-sm text-gray-500">
                        {user.account.role}
                      </p>
                    </div>
                    {isAdmin && (
                      <RemoveUserDialog
                        projectId={projectId}
                        userId={user.account.id}
                        userName={user.account.nom}
                      />
                    )}
                  </div>
                ))}
                {collaborators.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Aucun collaborateur assigné
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section Clients */}
          <div>
            <div className="flex gap-3 items-center mb-4">
              <User className="text-gray-500" />
              <h3 className="text-lg font-semibold">Clients</h3>
            </div>
            {usersLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <div className="space-y-2">
                {clients.map((user) => (
                  <div
                    key={user.account.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50/5 rounded"
                  >
                    <div>
                      <p className="font-medium">{user.account.nom}</p>
                      <p className="text-sm text-gray-500">
                        {user.account.role}
                      </p>
                    </div>
                    {isAdmin && (
                      <RemoveUserDialog
                        projectId={projectId}
                        userId={user.account.id}
                        userName={user.account.nom}
                      />
                    )}
                  </div>
                ))}
                {clients.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Aucun client assigné
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
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
