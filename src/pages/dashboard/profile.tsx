import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/useUser";

export function Profile() {
  const { data } = useSession();

  const { data: userInfo } = useUser(data?.session?.user.id);

  console.log(">>>>>>>>>", userInfo);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              p
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-sm text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
