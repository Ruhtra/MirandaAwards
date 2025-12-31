"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Gamepad2, FolderKanban, Vote, Menu, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { UserProfileSection } from "./user-profile-section"

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
    disabled: false,
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-card">
      <div className="flex items-center justify-around h-14 px-2">
        {firstThreeItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-colors",
                isActive && "text-foreground",
                item.disabled && "opacity-40 pointer-events-none",
                !isActive && !item.disabled && "text-muted-foreground hover:text-foreground",
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          )
        })}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg text-muted-foreground hover:text-foreground"
            >
              <Menu className="size-5" />
              <span className="text-[10px] font-medium">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[75vh] flex flex-col p-0">
            <SheetHeader className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Trophy className="size-4 text-primary-foreground" />
                </div>
                <SheetTitle className="text-lg font-semibold">Miranda Awards</SheetTitle>
              </div>
            </SheetHeader>

            <Separator />

            <ScrollArea className="flex-1 px-4">
              <div className="flex flex-col gap-0.5 py-2">
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
                        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors",
                        isActive && "bg-secondary text-foreground",
                        item.disabled && "opacity-40 pointer-events-none",
                        !isActive && !item.disabled && "hover:bg-secondary/50",
                      )}
                    >
                      <Icon className="size-4.5" />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.title}</span>
                        {item.disabled && <span className="text-xs text-muted-foreground">Em breve</span>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </ScrollArea>

            <Separator />

            <div className="px-4 py-3">
              <UserProfileSection />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
