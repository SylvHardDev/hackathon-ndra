import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold">
            Réinitialiser le mot de passe
          </CardTitle>
          <p className="text-sm text-gray-500">
            Entrez votre nouveau mot de passe.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nouveau mot de passe */}
          <div className="grid gap-1 relative">
            <Label htmlFor="newPassword" className="mb-2">
              Nouveau mot de passe
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
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
          {/* Confirmer nouveau mot de passe */}
          <div className="grid gap-1 relative">
            <Label htmlFor="confirmNewPassword" className="mb-2">
              Confirmer le mot de passe
            </Label>
            <div className="relative">
              <Input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 translate-y-[-50%] text-gray-500 hover:text-gray-700 outline-0"
                aria-label={
                  showConfirmPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button className="w-full">Réinitialiser</Button>
          <div className="text-center text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">
              Retour à la connexion
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
