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
import { useCreateUser } from "@/hooks/useCreateUser";

interface CreateUserDialogProps {
  onUserCreated?: () => Promise<void>;
}

export default function CreateUserDialog({
  onUserCreated,
}: CreateUserDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "employe" | "client">("employe");
  const [open, setOpen] = useState(false);

  const createUserMutation = useCreateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createUserMutation.mutate(
      {
        email,
        password,
        nom: fullName,
        role,
      },
      {
        onSuccess: async () => {
          // Réinitialiser le formulaire
          setEmail("");
          setPassword("");
          setFullName("");
          setRole("employe");
          setOpen(false);

          // Rafraîchir la liste des utilisateurs si le callback est fourni
          if (onUserCreated) {
            await onUserCreated();
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Créer un utilisateur
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Entrez l'email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password" className="mb-2">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Entrez le mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="fullName" className="mb-2">
              Nom complet
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Entrez le nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="role" className="mb-2">
              Rôle
            </Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as "admin" | "employe" | "client")
              }
            >
              <SelectTrigger className="w-1/2">
                <SelectValue placeholder="Choisissez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="employe">Collaborateur</SelectItem>
                <SelectItem value="client">Client</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer l'utilisateur"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
