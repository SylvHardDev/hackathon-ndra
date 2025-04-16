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

interface ProjectStatusDotProps {
  project: Projet;
}

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const statusConfigs: Record<Projet["statut"], StatusConfig> = {
  open: {
    label: "Ouvert",
    color: "rgb(100, 5, 100)",
    bgColor: "rgb(100, 5, 100, 0.5)",
    borderColor: "rgb(208, 226, 247)",
  },
  in_realisation: {
    label: "En réalisation",
    color: "rgb(38, 132, 255)",
    bgColor: "rgba(38, 132, 255, 0.3)",
    borderColor: "rgb(208, 226, 247)",
  },
  en_validation: {
    label: "En validation",
    color: "rgb(255, 171, 0)",
    bgColor: "rgba(255, 171, 0, 0.3)",
    borderColor: "rgb(255, 236, 199)",
  },
  modification_demandee: {
    label: "Modification demandée",
    color: "rgb(255, 86, 48)",
    bgColor: "rgba(255, 86, 48, 0.3)",
    borderColor: "rgb(255, 214, 204)",
  },
  ferme: {
    label: "Fermé",
    color: "rgba(0, 245, 0, 1)",
    bgColor: "rgba(0, 245, 0, 0.3)",
    borderColor: "rgb(223, 225, 230)",
  },
};

const availableStatuses = Object.keys(statusConfigs) as Projet["statut"][];

export default function ProjectStatusDot({ project }: ProjectStatusDotProps) {
  const [status, setStatus] = useState<Projet["statut"]>(project.statut);
  const currentConfig = statusConfigs[status];

  const handleStatusChange = (newStatus: Projet["statut"]) => {
    setStatus(newStatus);
    // Ici, appeler une mutation pour sauvegarder le nouveau statut dans la base de données
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
