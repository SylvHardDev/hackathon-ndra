import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProjectStatusDot from "./ProjectStatusDot";
import {
  MessageCircle,
  X,
  Upload,
  Calendar,
  Users,
  FileText,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Projet } from "./ProjectListView";
import { Card, CardContent } from "@/components/ui/card";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface ProjectDetailProps {
  project: Projet;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [showActivity, setShowActivity] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "John Doe",
      content: "Voici un commentaire sur le projet",
      timestamp: "16 janv. à 11:25 am",
    },
  ]);

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "Utilisateur actuel",
      content: newComment,
      timestamp: new Date().toLocaleString("fr-FR"),
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Gérer l'upload des fichiers ici
      console.log("Fichiers à uploader:", files);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex">
        {/* Main Content */}
        <div className={cn("flex-1", showActivity ? "mr-[400px]" : "")}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{project.titre}</h1>
            <ProjectStatusDot project={project} />
          </div>

          <div className="grid gap-6">
            {/* Informations principales */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date de début</p>
                      <p className="font-medium">
                        {project.dateDebut || "Non définie"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-medium">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium">{project.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Collaborateur</p>
                      <p className="font-medium">{project.collaborateur}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Upload */}
            <Card>
              <CardContent className="">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Déposez vos fichiers ici
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">ou</p>
                  <label className="cursor-pointer">
                    <Input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*,video/*"
                    />
                    <Button variant="outline">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Sélectionner des fichiers
                    </Button>
                  </label>
                </div>
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
              {comments.map((comment) => (
                <div key={comment.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-sm text-gray-500">
                      {comment.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Écrivez un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                />
                <Button onClick={handleSendComment}>Envoyer</Button>
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
