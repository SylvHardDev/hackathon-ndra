import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Réinitialisation</CardTitle>
          <p className="text-sm text-gray-500">
            Votre email pour réinitialiser votre mot de passe.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <Label htmlFor="email" className="text-start mb-2">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@example.com"
            />
          </div>
          <Button className="w-full">Envoyer</Button>
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
