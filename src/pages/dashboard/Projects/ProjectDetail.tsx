import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectStatusDot from "./ProjectStatusDot";
import {
  MessageCircle,
  X,
  Upload,
  Calendar,
  FileText,
  Pencil,
  Save,
  Loader2,
  Trash2,
  Maximize2,
  Edit,
  Eye,
  Reply,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Projet } from "./ProjectListView";
import { Card, CardContent } from "@/components/ui/card";
import { useCommentProject, ProjectComment } from "@/hooks/useCommentProject";
import { useProjectUsers } from "@/hooks/useProjectUsers";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { useProjectMedia } from "@/hooks/useProjectMedia";
import { Skeleton } from "@/components/ui/skeleton";
import { useRole } from "@/hooks/useRole";
import { useProjectAssignments } from "@/hooks/useProjectAssignments";
import AssignUsersDialog from "./AssignUsersDialog";
import RemoveUserDialog from "./RemoveUserDialog";
import DeleteProjectDialog from "./DeleteProjectDialog";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectDetailProps {
  project: Projet;
}

interface CommentProps {
  comment: ProjectComment;
  onReply: (parentId: number) => void;
}

function CommentItem({ comment, onReply }: CommentProps) {
  return (
    <div className="flex gap-3 mb-4 group">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          {comment.author?.nom?.charAt(0) || "?"}
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{comment.author?.nom}</span>
            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onReply(comment.id)}
        >
          <Reply className="h-3 w-3 mr-1" />
          Répondre
        </Button>
      </div>
    </div>
  );
}

export default function ProjectDetail({
  project: initialProject,
}: ProjectDetailProps) {
  const [showActivity, setShowActivity] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initialProject.title);
  const [editedDescription, setEditedDescription] = useState(
    initialProject.description || ""
  );
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: string;
  } | null>(null);
  const [replyToId, setReplyToId] = useState<number | null>(null);

  const { isAdmin, isCollab, isClient } = useRole();
  const { project, loading, updateProject } = useProjectDetail(
    initialProject.id
  );
  const {
    comments,
    loading: commentsLoading,
    addComment,
  } = useCommentProject(initialProject.id);
  const { loading: usersLoading } = useProjectUsers(initialProject.id);
  const {
    allAccounts,
    assignedIds,
    loading: assignmentsLoading,
    updateAssignments,
  } = useProjectAssignments(initialProject.id);
  const assignedUsers = allAccounts.filter((acct) =>
    assignedIds.includes(acct.id)
  );

  const {
    media,
    loading: mediaLoading,
    uploadMedia,
    deleteMedia,
  } = useProjectMedia(initialProject.id);

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

  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    try {
      console.log("Tentative d'envoi du commentaire:", {
        content: newComment,
        projectId: initialProject.id,
        replyToId,
      });

      const result = await addComment(
        newComment,
        replyToId ? parseInt(replyToId.toString()) : undefined
      );
      console.log("Commentaire ajouté avec succès:", result);

      setNewComment("");
      setReplyToId(null);
      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      console.error("Erreur détaillée lors de l'ajout du commentaire:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout du commentaire"
      );
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, project?.type as "video" | "design");
      }
      toast.success("Média(s) uploadé(s) avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Erreur lors de l'upload des médias");
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    try {
      await deleteMedia(mediaId);
      toast.success("Fichier supprimé avec succès");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      );
    }
  };

  const handleReply = (parentId: number) => {
    setReplyToId(parentId);
    setNewComment(`@${comments.find((c) => c.id === parentId)?.author?.nom} `);
  };

  // Organiser les commentaires en arbre
  const commentTree = comments.reduce(
    (acc: (ProjectComment & { replies: ProjectComment[] })[], comment) => {
      if (!comment.parent_id) {
        acc.push({
          ...comment,
          replies: comments.filter((c) => c.parent_id === comment.id),
        });
      }
      return acc;
    },
    []
  );

  if (
    loading ||
    commentsLoading ||
    usersLoading ||
    assignmentsLoading ||
    mediaLoading
  ) {
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
      {/* Modal de visualisation en grand écran */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualisation du média</DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="relative w-full aspect-video">
              {selectedMedia.type === "video" ? (
                <video
                  src={selectedMedia.url}
                  className="w-full h-full object-contain rounded-lg"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt="Media en grand écran"
                  className="w-full h-full object-contain rounded-lg"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex">
        {/* Main Content */}
        <div className={cn("flex-1", showActivity ? "mr-[400px]" : "")}>
          <div className="flex items-center justify-between mb-6">
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
                  <h1 className="text-2xl font-bold">{currentProject.title}</h1>
                  {isAdmin && (
                    <DeleteProjectDialog
                      projectId={currentProject.id}
                      projectName={currentProject.title}
                    />
                  )}
                </div>
                {currentProject.description && (
                  <p className="text-gray-600 mt-2">
                    {currentProject.description}
                  </p>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              {isAdmin && (
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
              )}
              <ProjectStatusDot
                project={currentProject}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>

          <div className="grid gap-6">
            {/* Informations principales */}
            <Card>
              <CardContent className="p-6 flex justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 gap-10">
                    <h3 className="text-lg font-semibold">
                      Utilisateurs assignés
                    </h3>
                    {isAdmin && (
                      <div>
                        <AssignUsersDialog projectId={currentProject.id} />
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
                              projectId={currentProject.id}
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
                        {new Date(
                          currentProject.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{currentProject.type}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Médias */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Médias du projet</h3>

                {mediaLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <div className="flex">
                    {media.map((item) => (
                      <div
                        key={item.id}
                        className="relative group w-full aspect-video"
                      >
                        {item.media_type === "video" ? (
                          <video
                            src={item.url}
                            className="w-full h-full object-cover rounded-lg"
                            controls
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt="Media"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="cursor-pointer"
                            onClick={() =>
                              setSelectedMedia({
                                url: item.url,
                                type: item.media_type,
                              })
                            }
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                          {item.media_type === "video" && isClient && (
                            <Button
                              variant="secondary"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() =>
                                (window.location.href = `/dashboard/projects/${project?.id}/video-edit`)
                              }
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {(isAdmin || isCollab) && (
                            <Button
                              variant="secondary"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() =>
                                (window.location.href = `/dashboard/projects/${project?.id}/video-edit`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {isCollab && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() => handleDeleteMedia(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {media.length === 0 && (
                      <p className="text-gray-500 text-center col-span-full py-4">
                        Aucun média pour ce projet
                      </p>
                    )}
                  </div>
                )}

                {isCollab && (
                  <div className="mt-4 flex flex-col gap-2">
                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      multiple
                      accept={
                        currentProject.type === "video" ? "video/*" : "image/*"
                      }
                      onChange={handleFileUpload}
                    />
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Uploader
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Activity Sidebar */}
        <div
          className={cn(
            "fixed right-0 top-0 w-[400px] border-l bg-white/2 h-full transition-transform duration-200 ease-in-out",
            showActivity ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Activité</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActivity(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col h-[calc(100%-64px)]">
            <ScrollArea className="flex-1 p-4">
              {commentTree.map((comment) => (
                <div key={comment.id} className="mb-6">
                  <CommentItem comment={comment} onReply={handleReply} />
                  {comment.replies.length > 0 && (
                    <div className="ml-12 space-y-4">
                      {comment.replies.map((reply) => (
                        <CommentItem
                          key={reply.id}
                          comment={reply}
                          onReply={handleReply}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Aucun commentaire pour le moment
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t">
              {replyToId && (
                <div className="flex items-center justify-between mb-2 bg-secondary/10 p-2 rounded">
                  <span className="text-sm">
                    Réponse à{" "}
                    {comments.find((c) => c.id === replyToId)?.author?.nom}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyToId(null);
                      setNewComment("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder={
                    replyToId
                      ? "Écrivez votre réponse..."
                      : "Écrivez un commentaire..."
                  }
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                />
                <Button onClick={handleSendComment}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Envoyer"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Activity Button */}
        {!showActivity && (
          <Button
            variant="outline"
            size="icon"
            className="fixed right-4 top-4"
            onClick={() => setShowActivity(true)}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
