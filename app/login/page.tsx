"use client";

import { useState } from "react";
// import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trophy, Gamepad2, Zap } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/lib/auth-client";
import { auth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onRequest: (ctx) => {
            setIsLoading(true);
          },
          onResponse: (ctx) => {
            // setIsLoading(false);
          },
          onError: (ctx) => {
            toast({
              title: "Erro de autenticação",
              description: "Credenciais inválidas. Por favor, tente novamente.",
              variant: "destructive",
            });
          },
          onSuccess: async (ctx) => {
            toast({
              title: "Login bem-sucedido",
              description: "Você foi autenticado com sucesso!",
            });
            await router.push("/admin/users");
          },
        }
      );
    } catch (error) {
      console.error("[v0] Erro ao fazer login:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer login",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 size-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 size-96 bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="size-20 rounded-2xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center glow-primary animate-pulse">
                <Trophy className="size-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 size-6 rounded-full bg-accent flex items-center justify-center glow-accent">
                <Zap className="size-4 text-accent-foreground" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2">
              Miranda Awards
            </h1>
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
              <Gamepad2 className="size-4" />
              Seu Game Awards Personalizado
            </p>
          </div>
        </div>

        {/* Login form card */}
        <div className="glass-card rounded-2xl shadow-2xl p-8 border-2">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Acesso
            </h2>
            <p className="text-muted-foreground text-sm">
              Entre com suas credenciais para continuar
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@mirandaawards.com"
                        className="h-11 bg-input/50 border-border focus:border-primary transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="h-11 bg-input/50 border-border focus:border-primary transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all font-semibold text-base glow-primary mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="size-4 mr-2" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Trophy className="size-4 mr-2" />
                    Entrar no Painel
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground">
          Feito com <span className="text-primary">♥</span> para gamers
          apaixonados
        </p>
      </div>
    </div>
  );
}
