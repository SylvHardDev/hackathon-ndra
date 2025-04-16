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
import { Plus } from "lucide-react";

export default function CreateProjectDialog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("image");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, tu pourrais intégrer la logique pour créer le projet dans ta base de données.
    console.log({ title, description, projectType });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
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
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="project-type" className="mb-2">
              Type de projet
            </Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Choisissez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Design</SelectItem>
                <SelectItem value="video">Vidéo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              Créer le projet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
