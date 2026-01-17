'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Monitor,
  Moon,
  Sun,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Lock,
  Sparkles,
  Zap,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-2xl font-semibold">Configurações</DialogTitle>
          <DialogDescription>Personalize sua experiência no Miranda Awards</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(85vh-120px)] px-6">
          <div className="space-y-6 pb-6">
            {/* Theme Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="text-muted-foreground size-5" />
                <h3 className="text-lg font-semibold">Aparência</h3>
              </div>
              <div className="space-y-3">
                <Label className="text-muted-foreground text-sm">Tema do aplicativo</Label>
                <RadioGroup
                  value={theme}
                  onValueChange={setTheme}
                  className="grid grid-cols-3 gap-3"
                >
                  <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label
                      htmlFor="light"
                      className="border-muted bg-card hover:bg-accent peer-data-[state=checked]:border-primary flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4"
                    >
                      <Sun className="size-5" />
                      <span className="text-sm font-medium">Claro</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label
                      htmlFor="dark"
                      className="border-muted bg-card hover:bg-accent peer-data-[state=checked]:border-primary flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4"
                    >
                      <Moon className="size-5" />
                      <span className="text-sm font-medium">Escuro</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label
                      htmlFor="system"
                      className="border-muted bg-card hover:bg-accent peer-data-[state=checked]:border-primary flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 p-4"
                    >
                      <Monitor className="size-5" />
                      <span className="text-sm font-medium">Sistema</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Separator />

            {/* Notifications Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="text-muted-foreground size-5" />
                <h3 className="text-lg font-semibold">Notificações</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications" className="text-sm font-medium">
                      Notificações push
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      Receba notificações no navegador
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-sm font-medium">
                      Notificações por email
                    </Label>
                    <p className="text-muted-foreground text-xs">Receba atualizações por email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="text-muted-foreground size-5" />
                <h3 className="text-lg font-semibold">Conta e Segurança</h3>
              </div>
              <div className="space-y-3">
                <div className="border-border hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="text-muted-foreground size-4" />
                    <span className="text-sm font-medium">Alterar senha</span>
                  </div>
                </div>
                <div className="border-border hover:bg-accent/50 flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="text-muted-foreground size-4" />
                    <span className="text-sm font-medium">Alterar email</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Coming Soon Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-muted-foreground size-5" />
                <h3 className="text-lg font-semibold">Em Breve</h3>
              </div>
              <div className="space-y-3 opacity-50">
                <div className="border-border flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Globe className="text-muted-foreground size-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Idioma</span>
                      <Badge variant="secondary" className="text-xs">
                        Em breve
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="border-border flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Zap className="text-muted-foreground size-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Atalhos de teclado</span>
                      <Badge variant="secondary" className="text-xs">
                        Em breve
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* App Version */}
            <div className="border-border border-t pt-4">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Versão do aplicativo</span>
                <span className="font-mono">v1.0.0</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
