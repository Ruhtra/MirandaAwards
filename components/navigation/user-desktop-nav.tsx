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

export function UserDesktopNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-border bg-card fixed top-0 right-0 left-0 z-50 hidden border-b md:block">
      <div className="mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary flex size-7 items-center justify-center rounded-lg">
              <Trophy className="text-primary-foreground size-4" />
            </div>
            <span className="text-foreground text-base font-semibold">Miranda Awards</span>
          </Link>

          <div className="flex items-center gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive && 'bg-secondary text-foreground',
                    !isActive &&
                      'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-1 px-2">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-72 flex-col p-0">
                <SheetHeader className="px-4 pt-4 pb-3">
                  <SheetTitle className="text-base font-semibold">Menu</SheetTitle>
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
        </div>
      </div>
    </nav>
  )
}
