import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<"design" | "video">("design");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      // Création du projet
      const { data: project, error: projectError } = await supabase
        .from("project")
        .insert([
          {
            title,
            description,
            type: projectType,
            status: "open",
          },
        ])
        .select("id")
        .single();

      if (projectError || !project) throw projectError;

      // Assignation de l'utilisateur courant au projet
      const { error: assignError } = await supabase
        .from("project_account")
        .insert([
          {
            project_id: project.id,
          },
        ]);

      if (assignError) throw assignError;

      toast({
        title: "Succès",
        description: "Le projet a été créé avec succès.",
      });

      // Réinitialisation et fermeture
      setTitle("");
      setDescription("");
      setProjectType("design");
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description:
          (error as Error).message || "Impossible de créer le projet.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau projet
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Créer un projet
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="title" className="mb-2">
              Titre
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Entrez le titre du projet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="description" className="mb-2">
              Description
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Description du projet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="project-type" className="mb-2">
              Type de projet
            </Label>
            <Select
              value={projectType}
              onValueChange={(value) =>
                setProjectType(value as "design" | "video")
              }
              disabled={isLoading}
            >
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Choisissez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="video">Vidéo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              <span>{isLoading ? "Création..." : "Créer le projet"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
