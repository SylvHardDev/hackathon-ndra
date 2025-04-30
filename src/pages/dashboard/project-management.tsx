import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateProjectDialog from "./CreateProjectDialog";
import ProjectListView from "./Projects/ProjectListView";
import { useRole } from "@/hooks/useRole";
import { useState, useRef } from "react";
import { useProjects } from "@/hooks/useProjects";

export function ProjectManagement() {
  const { isAdmin } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { refreshProjects } = useProjects();
  // Référence au composant ProjectListView pour forcer le rafraîchissement
  const projectListRef = useRef<{ refreshList: () => Promise<void> } | null>(
    null
  );

  // Fonction de rafraîchissement qui sera passée à CreateProjectDialog
  const handleProjectCreated = async () => {
    // Rafraîchir les projets via le hook useProjects
    await refreshProjects();

    // Si la référence au composant existe, appeler sa méthode de rafraîchissement
    if (projectListRef.current) {
      await projectListRef.current.refreshList();
    }
  };

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestion des projets</h1>
          <CreateProjectDialog onProjectCreated={handleProjectCreated} />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des projets..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="open">Ouvert</SelectItem>
            <SelectItem value="in_realisation">En réalisation</SelectItem>
            <SelectItem value="in_validation">En validation</SelectItem>
            <SelectItem value="need_revision">Modification demandée</SelectItem>
            <SelectItem value="closed">Fermé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProjectListView
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        ref={projectListRef}
      />
    </div>
  );
}
