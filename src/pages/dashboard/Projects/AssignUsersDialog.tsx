// src/components/project/AssignUsersDialog.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, UserPlus } from "lucide-react";
import { useProjectAssignments } from "@/hooks/useProjectAssignments";

interface AssignUsersDialogProps {
  projectId: number;
}

export default function AssignUsersDialog({
  projectId,
}: AssignUsersDialogProps) {
  const { allAccounts, assignedIds, updateAssignments, loading } =
    useProjectAssignments(projectId);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>(assignedIds);
  const [saving, setSaving] = useState(false);

  // Sync avec assignedIds quand ouvré ou mis à jour
  React.useEffect(() => {
    setSelected(assignedIds);
  }, [assignedIds, open]);

  const toggleId = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await updateAssignments(selected);
    setSaving(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <UserPlus className="mr-2 h-4 w-4" /> Assigner des utilisateurs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assigner des utilisateurs</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-auto">
            {allAccounts.map((acct) => (
              <div
                key={acct.id}
                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
              >
                <Checkbox
                  checked={selected.includes(acct.id)}
                  onCheckedChange={() => toggleId(acct.id)}
                />
                <div>
                  <p className="font-medium">{acct.nom}</p>
                  <p className="text-sm text-gray-500">{acct.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="w-full flex justify-center"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            <span>{saving ? "Sauvegarde..." : "Enregistrer"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
