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
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const { form, resetPassword, isLoading } = useForgotPassword();

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Réinitialisation</CardTitle>
          <p className="text-sm text-gray-500">
            Votre email pour réinitialiser votre mot de passe.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(resetPassword)}
              className="space-y-4"
            >
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
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  "Envoyer"
                )}
              </Button>
            </form>
          </Form>
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
