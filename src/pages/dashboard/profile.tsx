import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/hooks/useSession";
import { useRole } from "@/hooks/useRole";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/hooks/getAllUsers";

interface UserProfile {
  id: number;
  nom: string;
  role: string;
  email: string;
}

export function Profile() {
  const { data } = useSession();
  const { userRole } = useRole();
  const [userInfo, setUserInfo] = useState<UserProfile | null>(null);
  const getUsers = getAllUsers();

  useEffect(() => {
    if (data?.session?.user.id) {
      getUsers.mutate(undefined, {
        onSuccess: (users) => {
          const userId = Number(data.session.user.id);
          const currentUser = users.find((user) => user.id === userId);
          if (currentUser) {
            setUserInfo(currentUser);
          }
        },
      });
    }
  }, [data?.session?.user.id, getUsers]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-5xl flex items-center justify-center">
                {userInfo?.nom?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{userInfo?.nom}</h3>
              <p className="text-sm text-muted-foreground">{userRole}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground break-all">
                {userInfo?.email || "Chargement..."}
              </p>
              {!userInfo && (
                <p className="text-xs text-red-500">Données non chargées</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <p className="text-sm text-muted-foreground">{userRole}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
