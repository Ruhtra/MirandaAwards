"use client"

import { Upload, UserCircle } from "lucide-react"
import type { Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserFormFieldsProps {
  control: Control<any>
  avatarUrl?: string
  showPasswordField?: boolean
  passwordLabel?: string
  passwordPlaceholder?: string
}

export function UserFormFields({
  control,
  avatarUrl,
  showPasswordField = true,
  passwordLabel = "Senha",
  passwordPlaceholder = "••••••••",
}: UserFormFieldsProps) {
  return (
    <>
      {/* Avatar Upload Section */}
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative">
          <div className="size-24 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
            <Avatar className="size-full rounded-xl">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="User avatar" />
              <AvatarFallback className="rounded-xl bg-transparent">
                <UserCircle className="size-12 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
          </div>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute -bottom-2 -right-2 size-8 rounded-full shadow-md"
          >
            <Upload className="size-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Clique para adicionar foto</p>
      </div>

      {/* Name Field */}
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="João Silva" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email Field */}
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="joao@example.com" {...field} value={field.value || ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Password Field */}
      {showPasswordField && (
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{passwordLabel}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={passwordPlaceholder} {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Role Field */}
      <FormField
        control={control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Função</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="USER">Usuário</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Active Status */}
      <div className="flex items-center justify-between rounded-lg border p-3">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Status do Usuário</label>
          <p className="text-xs text-muted-foreground">Ativo ou inativo no sistema</p>
        </div>
        <Switch defaultChecked />
      </div>
    </>
  )
}
