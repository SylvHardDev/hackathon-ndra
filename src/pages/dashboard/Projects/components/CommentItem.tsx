import { ProjectComment } from "@/hooks/useCommentProject";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reply } from "lucide-react";
import useAuth from "@/hooks/useAuth";

interface CommentProps {
  comment: ProjectComment;
  onReply: (parentId: number) => void;
}

export function CommentItem({ comment, onReply }: CommentProps) {
  const { user } = useAuth();
  const isCurrentUser = user?.id === comment.author?.id;

  return (
    <div
      className={cn(
        "flex gap-3 mb-4 group",
        isCurrentUser ? "flex-row-reverse" : ""
      )}
    >
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          {comment.author?.nom?.charAt(0) || "?"}
        </div>
      </div>
      <div className={cn("flex-1", isCurrentUser ? "text-right" : "")}>
        <div
          className={cn(
            "rounded-lg p-3",
            isCurrentUser
              ? "bg-primary text-primary-foreground border border-red-500"
              : "bg-secondary/20"
          )}
        >
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
