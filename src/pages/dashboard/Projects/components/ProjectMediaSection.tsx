import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useProjectMedia } from "@/hooks/useProjectMedia";
import { useRole } from "@/hooks/useRole";
import { Edit, Eye, Loader2, Maximize2, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectMediaSectionProps {
  projectId: number;
  projectType: string;
}

export function ProjectMediaSection({
  projectId,
  projectType,
}: ProjectMediaSectionProps) {
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: string;
  } | null>(null);

  const { isAdmin, isCollab, isClient } = useRole();
  const {
    media,
    loading: mediaLoading,
    uploadMedia,
    deleteMedia,
  } = useProjectMedia(projectId);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, projectType as "video" | "design");
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

  return (
    <>
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
                          (window.location.href = `/dashboard/projects/${projectId}/video-edit`)
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
                          (window.location.href = `/dashboard/projects/${projectId}/video-edit`)
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
                accept={projectType === "video" ? "video/*" : "image/*"}
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Uploader
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
