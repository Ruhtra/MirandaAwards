"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Gamepad2, FolderKanban, Vote, Menu } from "lucide-react"
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

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const firstThreeItems = navItems.slice(0, 3)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-lg supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-around h-16 px-2">
        {firstThreeItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-all",
                isActive && "text-primary",
                item.disabled && "opacity-40 pointer-events-none",
                !isActive && !item.disabled && "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <Icon className={cn("size-5", isActive && "glow-primary")} />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          )
        })}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50"
            >
              <Menu className="size-5" />
              <span className="text-xs font-medium">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] glass-card">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Miranda Awards
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
    </nav>
  )
}
