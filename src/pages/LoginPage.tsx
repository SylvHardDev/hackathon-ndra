import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <p className="text-sm text-gray-500">
            Entrez vos identifiants pour accéder à votre compte.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@example.com"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Se connecter</Button>
          <div className="flex justify-between text-sm">
            <Link
              to="/reset-password"
              className="text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
            <Link to="/signup" className="text-blue-600 hover:underline">
              Créer un compte
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
