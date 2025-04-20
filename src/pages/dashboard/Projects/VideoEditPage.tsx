import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useVideoComments } from "@/hooks/useVideoComments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2, MessageSquarePlus } from "lucide-react";
import { useProjectMedia } from "@/hooks/useProjectMedia";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function VideoEditPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const { media, loading: mediaLoading } = useProjectMedia(Number(projectId));
  const {
    comments,
    loading: commentsLoading,
    addComment,
    updateComment,
    deleteComment,
  } = useVideoComments(Number(projectId));

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(Math.floor(videoRef.current.currentTime));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      console.log("Tentative d'ajout de commentaire:", {
        projectId,
        timecode: currentTime,
        content: newComment,
      });

      const user = await supabase.auth.getUser();
      console.log("Utilisateur actuel:", user.data.user?.id);

      const result = await addComment(currentTime, newComment);
      console.log("Commentaire ajouté avec succès:", result);

      setNewComment("");
      setShowCommentModal(false);
      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      console.log("Tentative de mise à jour du commentaire:", {
        commentId,
        content: editContent,
      });

      const result = await updateComment(commentId, editContent);
      console.log("Commentaire mis à jour avec succès:", result);

      setEditingComment(null);
      toast.success("Commentaire mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du commentaire:", error);
      toast.error("Erreur lors de la mise à jour du commentaire");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      console.log("Tentative de suppression du commentaire:", commentId);

      await deleteComment(commentId);
      console.log("Commentaire supprimé avec succès");

      toast.success("Commentaire supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire:", error);
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  const handleCommentClick = (timecode: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timecode;
      videoRef.current.play();
    }
  };

  const handlePlay = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  if (mediaLoading || commentsLoading) {
    return <div>Chargement...</div>;
  }

  const video = media.find((m) => m.media_type === "video");
  if (!video) {
    return <div>Aucune vidéo trouvée</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <video
              ref={videoRef}
              src={video.url}
              className="w-full rounded-lg"
              controls
              onTimeUpdate={handleTimeUpdate}
              onPlay={handlePlay}
              onPause={handlePause}
            />
            {isPaused && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                onClick={() => setShowCommentModal(true)}
              >
                <MessageSquarePlus className="h-4 w-4 mr-2" />
                Ajouter un commentaire
              </Button>
            )}
            {showCommentModal && (
              <Dialog
                open={showCommentModal}
                onOpenChange={setShowCommentModal}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un commentaire</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      Temps:{" "}
                      {new Date(currentTime * 1000).toISOString().substr(11, 8)}
                    </p>
                    <Input
                      placeholder="Votre commentaire..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 relative z-50">
                      <Button
                        variant="outline"
                        onClick={() => setShowCommentModal(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        className="relative z-50"
                        onClick={handleAddComment}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            <h3 className="text-lg font-semibold mb-4">Commentaires</h3>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCommentClick(comment.timecode)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.timecode * 1000)
                          .toISOString()
                          .substr(11, 8)}
                      </p>
                      {editingComment === comment.id ? (
                        <div className="mt-2 space-y-2">
                          <Input
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateComment(comment.id)}
                            >
                              Enregistrer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingComment(null)}
                            >
                              Annuler
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1">{comment.content}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteComment(comment.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
