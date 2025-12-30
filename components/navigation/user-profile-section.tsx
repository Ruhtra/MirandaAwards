"use client";

import { useState } from "react";
import { Settings, LogOut, UserIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SettingsDialog } from "./settings-dialog";
import { redirect } from "next/navigation";

interface UserProfileSectionProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
}

export function UserProfileSection({ user }: UserProfileSectionProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mock user data - replace with real user data
  const currentUser = user || {
    name: "João Silva",
    email: "joao@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "ADMIN",
  };

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    redirect("/logout");
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: "Administrador",
      USER: "Usuário",
      MODERATOR: "Moderador",
    };
    return labels[role] || role;
  };

  const getRoleVariant = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      ADMIN: "default",
      USER: "secondary",
      MODERATOR: "outline",
    };
    return variants[role] || "secondary";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between gap-2 h-auto py-2 px-3 hover:bg-secondary/50"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="size-9 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex-shrink-0">
                <Avatar className="size-full rounded-lg">
                  <AvatarImage
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="rounded-lg bg-transparent text-primary font-medium text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 text-left overflow-hidden min-w-0">
                <p className="text-sm font-medium text-foreground truncate leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-xs text-muted-foreground truncate leading-tight">
                  {currentUser.email}
                </p>
              </div>
            </div>
            <ChevronRight className="size-3.5 text-muted-foreground flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-2.5">
              <div className="size-10 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex-shrink-0">
                <Avatar className="size-full rounded-lg">
                  <AvatarImage
                    src={currentUser.avatar || "/placeholder.svg"}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="rounded-lg bg-transparent text-primary font-medium">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-muted-foreground truncate mb-1">
                  {currentUser.email}
                </p>
                <Badge
                  variant={getRoleVariant(currentUser.role)}
                  className="text-[10px] h-4 px-1.5"
                >
                  {getRoleLabel(currentUser.role)}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              // Navigate to profile page
            }}
            className="cursor-pointer"
          >
            <UserIcon className="size-4 mr-2" />
            <span>Meu Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSettingsOpen(true)}
            className="cursor-pointer"
          >
            <Settings className="size-4 mr-2" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="size-4 mr-2" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
