import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCommentProject, ProjectComment } from "@/hooks/useCommentProject";
import { X, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { CommentItem } from "./CommentItem";
import { cn } from "@/lib/utils";

interface ActivitySidebarProps {
  projectId: number;
  showActivity: boolean;
  onClose: () => void;
}

export function ActivitySidebar({
  projectId,
  showActivity,
  onClose,
}: ActivitySidebarProps) {
  const [newComment, setNewComment] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const { comments, addComment } = useCommentProject(projectId);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleSendComment = async () => {
    if (!newComment.trim() || isSendingComment) return;

    setIsSendingComment(true);
    try {
      await addComment(
        newComment,
        replyToId ? parseInt(replyToId.toString()) : undefined
      );
      setNewComment("");
      setReplyToId(null);
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
    } finally {
      setIsSendingComment(false);
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

  return (
    <div
      className={cn(
        "fixed right-0 top-0 w-[400px] border-l bg-white/2 h-full transition-transform duration-200 ease-in-out",
        showActivity ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Activité</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
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
          <div ref={commentsEndRef} />
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendComment();
                }
              }}
            />
            <Button
              onClick={handleSendComment}
              disabled={isSendingComment || !newComment.trim()}
            >
              {isSendingComment ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Envoyer"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
