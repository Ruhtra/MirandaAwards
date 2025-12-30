"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Gamepad2, FolderKanban, Vote, Menu, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  disabled?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
    disabled: false,
  },
  {
    title: "Jogos",
    href: "/admin/games",
    icon: Gamepad2,
    disabled: true,
  },
  {
    title: "Categorias",
    href: "/admin/categories",
    icon: FolderKanban,
    disabled: true,
  },
  {
    title: "Votos",
    href: "/admin/votes",
    icon: Vote,
    disabled: true,
  },
]

export function DesktopNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur-lg supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary">
              <Trophy className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Miranda Awards
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {navItems.slice(0, 3).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium",
                    isActive && "bg-primary/10 text-primary border border-primary/20 glow-primary",
                    item.disabled && "opacity-40 pointer-events-none",
                    !isActive && !item.disabled && "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                  )}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <Icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2 bg-transparent">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass-card">
                <SheetHeader className="mb-6">
                  <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Menu Completo
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.disabled ? "#" : item.href}
                        onClick={(e) => {
                          if (item.disabled) {
                            e.preventDefault()
                          } else {
                            setOpen(false)
                          }
                        }}
                        className={cn(
                          "flex items-center gap-4 p-4 rounded-lg transition-all",
                          isActive && "bg-primary/10 text-primary border border-primary/20",
                          item.disabled && "opacity-40 pointer-events-none",
                          !isActive && !item.disabled && "hover:bg-accent/50",
                        )}
                      >
                        <Icon className={cn("size-5", isActive && "glow-primary")} />
                        <div className="flex flex-col">
                          <span className="font-medium">{item.title}</span>
                          {item.disabled && <span className="text-xs text-muted-foreground">Em breve</span>}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
