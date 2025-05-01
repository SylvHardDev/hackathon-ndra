import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useLogin";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { form, login, isLoading, error } = useLogin();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Déterminer le type d'erreur pour afficher un message spécifique
  const getErrorMessage = (errorMessage: string | undefined) => {
    if (!errorMessage) return null;

    if (errorMessage.includes("Invalid login credentials")) {
      return "Identifiants invalides. Vérifiez votre email et mot de passe.";
    } else if (errorMessage.includes("Email not confirmed")) {
      return "Votre email n'a pas été confirmé. Veuillez vérifier votre boîte mail.";
    } else if (errorMessage.includes("Too many requests")) {
      return "Trop de tentatives. Veuillez réessayer plus tard.";
    }

    return errorMessage;
  };

  const errorMessage = error ? getErrorMessage(error.message) : null;

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
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(login)} className="space-y-4">
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
                    <FormMessage />
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
                        <div className="absolute inset-y-0 right-0 flex items-center pr-10 pointer-events-none">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter"
                )}
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
