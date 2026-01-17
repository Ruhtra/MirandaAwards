'use client'

import { useState } from 'react'
// import { authClient } from "@/lib/auth-client"
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '@/lib/validations/user'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Trophy, Gamepad2, Zap } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/hooks/use-toast'
import { signIn } from '@/lib/auth-client'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)

    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onRequest: (ctx) => {
            setIsLoading(true)
          },
          onResponse: (ctx) => {
            // setIsLoading(false);
          },
          onError: (ctx) => {
            toast({
              title: 'Erro de autenticação',
              description: 'Credenciais inválidas. Por favor, tente novamente.',
              variant: 'destructive',
            })

            setIsLoading(false)
          },

          onSuccess: async (ctx) => {
            const role = ctx.data.user.role

            toast({
              title: 'Login bem-sucedido',
              description: 'Você foi autenticado com sucesso!',
            })

            if (role === 'ADMIN') {
              await router.push(DEFAULT_LOGIN_REDIRECT.ADMIN)
            } else if (role === 'USER') {
              await router.push(DEFAULT_LOGIN_REDIRECT.USER)
            }
          },
        },
      )
    } catch (error) {
      console.error('[v0] Erro ao fazer login:', error)
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao fazer login',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-primary/10 absolute top-20 left-10 size-64 animate-pulse rounded-full blur-[100px]" />
        <div className="bg-accent/10 absolute right-10 bottom-20 size-96 animate-pulse rounded-full blur-[120px] delay-700" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Logo and branding */}
        <div className="space-y-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="from-primary via-primary to-accent glow-primary flex size-20 animate-pulse items-center justify-center rounded-2xl bg-gradient-to-br">
                <Trophy className="text-primary-foreground size-10" />
              </div>
              <div className="bg-accent glow-accent absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full">
                <Zap className="text-accent-foreground size-4" />
              </div>
            </div>
          </div>
          <div>
            <h1 className="from-primary via-primary to-accent mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
              Miranda Awards
            </h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
              <Gamepad2 className="size-4" />
              Seu Game Awards Personalizado
            </p>
          </div>
        </div>

        {/* Login form card */}
        <div className="glass-card rounded-2xl border-2 p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-foreground mb-2 text-2xl font-semibold">Acesso</h2>
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
                    <FormLabel className="text-foreground font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@mirandaawards.com"
                        className="bg-input/50 border-border focus:border-primary h-11 transition-all"
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
                    <FormLabel className="text-foreground font-medium">Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="bg-input/50 border-border focus:border-primary h-11 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="from-primary to-accent glow-primary mt-6 h-11 w-full bg-gradient-to-r text-base font-semibold transition-all hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 size-4" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 size-4" />
                    Entrar no Painel
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer text */}
        <p className="text-muted-foreground text-center text-xs">
          Feito com <span className="text-primary">♥</span> para gamers apaixonados
        </p>
      </div>
    </div>
  )
}
