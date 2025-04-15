import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogoutUser } from "@/hooks/useLogoutUser";
import { useRole } from "@/hooks/useRole";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const updateProfileSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
});

const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(
        /[^A-Za-z0-9]/,
        "Le mot de passe doit contenir au moins un caractère spécial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type UpdateProfileData = z.infer<typeof updateProfileSchema>;
type UpdatePasswordData = z.infer<typeof updatePasswordSchema>;

export default function UserPage() {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { isLoading: isRoleLoading } = useRole();
  const { updateProfile, updatePassword, isUpdating, isChangingPassword } =
    useUpdateProfile();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutUser();

  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: account, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return {
        email: user.email,
        ...account,
      };
    },
  });

  const updateProfileForm = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nom: userData?.nom || "",
    },
  });

  const passwordForm = useForm<UpdatePasswordData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onUpdateProfile = (data: UpdateProfileData) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsUpdateDialogOpen(false);
        updateProfileForm.reset();
      },
    });
  };

  const onUpdatePassword = (data: UpdatePasswordData) => {
    updatePassword(
      { password: data.password },
      {
        onSuccess: () => {
          setIsPasswordDialogOpen(false);
          passwordForm.reset();
        },
      }
    );
  };

  if (isRoleLoading || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Aucune donnée utilisateur trouvée</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Mon Profil</CardTitle>
            <CardDescription>
              Consultez et gérez vos informations personnelles
            </CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isLoggingOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Êtes-vous sûr de vouloir vous déconnecter ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action vous déconnectera de votre compte. Vous devrez
                  vous reconnecter pour accéder à votre profil.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => logout()}>
                  Se déconnecter
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input value={userData.nom} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={userData.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <Input
              value={userData.role === "admin" ? "Administrateur" : "Client"}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label>Date de création du compte</Label>
            <Input
              value={new Date(userData.created_at).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              disabled
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {/* Dialog pour changer le mot de passe */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Changer le mot de passe</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Changer votre mot de passe ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action vous permettra de définir un nouveau mot de passe
                  pour votre compte. Assurez-vous de choisir un mot de passe
                  sécurisé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => setIsPasswordDialogOpen(true)}
                >
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog
            open={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Changer le mot de passe</DialogTitle>
                <DialogDescription>
                  Entrez votre nouveau mot de passe ci-dessous. Le mot de passe
                  doit contenir au moins 8 caractères, une majuscule, une
                  minuscule, un chiffre et un caractère spécial.
                </DialogDescription>
              </DialogHeader>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onUpdatePassword)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword
                        ? "Modification..."
                        : "Changer le mot de passe"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Dialog pour mettre à jour le profil */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Mettre à jour le profil</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Mettre à jour votre profil ?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action vous permettra de modifier vos informations
                  personnelles.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => setIsUpdateDialogOpen(true)}>
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Dialog
            open={isUpdateDialogOpen}
            onOpenChange={setIsUpdateDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mettre à jour le profil</DialogTitle>
                <DialogDescription>
                  Modifiez vos informations personnelles ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <Form {...updateProfileForm}>
                <form
                  onSubmit={updateProfileForm.handleSubmit(onUpdateProfile)}
                  className="space-y-4"
                >
                  <FormField
                    control={updateProfileForm.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
