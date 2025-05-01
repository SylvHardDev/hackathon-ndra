import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/hooks/useSession";
import { useRole } from "@/hooks/useRole";
import { useUser } from "@/hooks/useUser";

export function Profile() {
  const { data } = useSession();
  const { userRole } = useRole();

  const { data: userInfo } = useUser(data?.session?.user.id);

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
                {userInfo?.[0]?.nom?.charAt(0)?.toUpperCase() ||
                  data?.session?.user?.email?.charAt(0)?.toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">
                {userInfo?.[0]?.nom || data?.session?.user?.email}
              </h3>
              <p className="text-sm text-muted-foreground">{userRole}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground break-all">
                {userInfo?.[0]?.email || data?.session?.user?.email}
              </p>
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
