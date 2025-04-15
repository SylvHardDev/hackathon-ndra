import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Définition du schéma de validation avec Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "L'email est requis" })
    .email({ message: "Format d'email invalide" }),
  password: z
    .string()
    .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  // Initialisation de React Hook Form avec le schéma Zod
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validation au changement pour un feedback immédiat
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = (data) => {
    console.log("Données de connexion:", data);
    // Ici, vous intégreriez la logique d'authentification
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm rounded-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <p className="text-sm text-gray-500">
            Entrez vos identifiants pour accéder à votre compte.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <Label htmlFor="email" className="block mb-2">
                      Email
                    </Label>
                    <div className="relative">
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre.email@example.com"
                          className={`rounded-sm py-5 ${
                            fieldState.error ? "border-red-500 pr-10" : ""
                          }`}
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {fieldState.error && (
                      <FormMessage className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {fieldState.error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <Label htmlFor="password" className="block mb-2">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <FormControl>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className={`rounded-sm py-5 ${
                            fieldState.error ? "border-red-500" : ""
                          } pr-10`}
                          {...field}
                        />
                      </FormControl>
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
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                      {fieldState.error && (
                        <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {fieldState.error && (
                      <FormMessage className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {fieldState.error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid}
              >
                Se connecter
              </Button>
            </form>
          </Form>

          <div className="flex justify-between text-sm">
            <Link
              to="/forgot-password"
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
