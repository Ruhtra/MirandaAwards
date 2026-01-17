'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Gamepad2, Menu, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { UserProfileSection } from './user-profile-section'

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/user/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Jogos',
    href: '/user/games',
    icon: Gamepad2,
  },
]

export function UserMobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-border bg-card fixed right-0 bottom-0 left-0 z-50 border-t md:hidden">
      <div className="flex h-14 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg transition-colors',
                isActive && 'text-foreground',
                !isActive && 'text-muted-foreground hover:text-foreground',
              )}
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
              className="text-muted-foreground hover:text-foreground flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg"
            >
              <Menu className="size-5" />
              <span className="text-[10px] font-medium">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="flex h-[50vh] flex-col p-0">
            <SheetHeader className="px-4 pt-4 pb-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary flex size-7 flex-shrink-0 items-center justify-center rounded-lg">
                  <Trophy className="text-primary-foreground size-4" />
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
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors',
                        isActive && 'bg-secondary text-foreground',
                        !isActive && 'hover:bg-secondary/50',
                      )}
                    >
                      <Icon className="size-4.5" />
                      <span className="text-sm font-medium">{item.title}</span>
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
