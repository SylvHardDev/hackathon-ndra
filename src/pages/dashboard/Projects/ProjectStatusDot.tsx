import { Button } from "@/components/ui/button";
import { Projet } from "./ProjectListView";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";

interface ProjectStatusDotProps {
  project: Projet;
  onStatusChange?: (newStatus: Projet["status"]) => void;
}

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const statusConfigs: Record<Projet["status"], StatusConfig> = {
  open: {
    label: "Ouvert",
    color: "#640564",
    bgColor: "rgba(100, 5, 100, 0.5)",
    borderColor: "#d0e2f7",
  },
  in_realisation: {
    label: "En réalisation",
    color: "#2684ff",
    bgColor: "rgba(38, 132, 255, 0.5)",
    borderColor: "#d0e2f7",
  },
  in_validation: {
    label: "En validation",
    color: "#ffab00",
    bgColor: "rgba(255, 171, 0, 0.5)",
    borderColor: "#ffecb3",
  },
  validate: {
    label: "Validé",
    color: "#00c800",
    bgColor: "rgba(0, 200, 0, 0.5)",
    borderColor: "#dfe1e6",
  },
  need_revision: {
    label: "Modification demandée",
    color: "#ff5630",
    bgColor: "rgba(255, 86, 48, 0.5)",
    borderColor: "#ffd6cc",
  },
  closed: {
    label: "Fermé",
    color: "#00f500",
    bgColor: "rgba(0, 245, 0, 0.5)",
    borderColor: "#dfe1e6",
  },
};

const availableStatuses = Object.keys(statusConfigs) as Projet["status"][];

export default function ProjectStatusDot({
  project,
  onStatusChange,
}: ProjectStatusDotProps) {
  const [status, setStatus] = useState<Projet["status"]>(project.status);
  const { updateProject } = useProjects();
  const currentConfig = statusConfigs[status];

  const handleStatusChange = async (newStatus: Projet["status"]) => {
    try {
      const updatedProject = await updateProject(project.id, {
        status: newStatus,
      });

      if (updatedProject) {
        setStatus(newStatus);
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 px-2 hover:!bg-transparent cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span
              className="text-sm font-medium rounded-sm px-2 py-1"
              style={{
                background: currentConfig.bgColor,
              }}
            >
              {currentConfig.label}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-1">
        <div className="flex flex-col gap-1">
          {availableStatuses.map((s) => {
            const config = statusConfigs[s];
            return (
              <Button
                key={s}
                variant="ghost"
                className={cn(
                  "flex items-center justify-between px-2 py-1.5 text-sm font-normal",
                  status === s && "bg-gray-100/2"
                )}
                onClick={() => handleStatusChange(s)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: config.color,
                    }}
                  />
                  <span style={{ color: config.color }}>{config.label}</span>
                </div>
                {status === s && (
                  <Check className="h-4 w-4" style={{ color: config.color }} />
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
