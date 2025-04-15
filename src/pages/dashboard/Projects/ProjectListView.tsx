import { useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectStatusDot from "./ProjectStatusDot";

export type ProjectType = "video" | "design";

// Définition d'un type pour un projet
export interface Projet {
  id: number;
  titre: string;
  statut:
    | "open"
    | "in_realisation"
    | "en_validation"
    | "modification_demandee"
    | "ferme";
  collaborateur: string;
  client: string;
  type: ProjectType;
}

// Exemple de données simulées
const dummyProjects: Projet[] = [
  {
    id: 1,
    titre: "Projet Alpha",
    statut: "open",
    collaborateur: "Alice",
    client: "Client A",
    type: "video",
  },
  {
    id: 2,
    titre: "Projet Beta",
    statut: "in_realisation",
    collaborateur: "Bob",
    client: "Client B",
    type: "design",
  },
  {
    id: 3,
    titre: "Projet Gamma",
    statut: "en_validation",
    collaborateur: "Charlie",
    client: "Client C",
    type: "video",
  },
];

export default function ProjectListView() {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Tabs
          value={viewMode}
          onValueChange={(val) => setViewMode(val as "list" | "kanban")}
          className="w-full"
        >
          <TabsList className="w-1/3 justify-start">
            <TabsTrigger value="list" className="flex-1">
              Liste
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex-1">
              Kanban
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === "list" && (
        <div className="rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/5">
                <TableHead className="w-[250px] font-semibold">Titre</TableHead>
                <TableHead className="w-[150px] font-semibold">
                  Statut
                </TableHead>
                <TableHead className="w-[150px] font-semibold">Type</TableHead>
                <TableHead className="w-[150px] font-semibold">
                  Client
                </TableHead>
                <TableHead className="w-[150px] font-semibold">
                  Collaborateur
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyProjects.map((project) => (
                <TableRow key={project.id} className="hover:bg-gray-50/2">
                  <TableCell className="font-medium">{project.titre}</TableCell>
                  <TableCell>
                    <ProjectStatusDot project={project} />
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-2 text-xs font-medium rounded-sm bg-gray-100/2">
                      {project.type}
                    </span>
                  </TableCell>
                  <TableCell>{project.client}</TableCell>
                  <TableCell>{project.collaborateur}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {viewMode === "kanban" && (
        <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-lg">
          La vue Kanban sera bientôt disponible.
        </div>
      )}
    </div>
  );
}
