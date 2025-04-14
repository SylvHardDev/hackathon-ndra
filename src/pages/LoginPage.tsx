import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm rounded-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <p className="text-sm text-gray-500">
            Entrez vos identifiants pour accéder à votre compte.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="email" className="mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@example.com"
              className="rounded-sm py-5"
            />
          </div>
          <div className="grid gap-1 relative">
            <Label htmlFor="password" className="mb-2">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10 rounded-sm py-5"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 translate-y-[-50%] text-gray-500 hover:text-gray-700 outline-0"
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button className="w-full">Se connecter</Button>
          <div className="flex justify-between text-sm">
            <Link
              to="/reset-password"
              className="text-blue-600 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
