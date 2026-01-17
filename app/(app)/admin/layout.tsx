import type React from 'react'
import { MobileNav } from '@/components/navigation/mobile-nav'
import { DesktopNav } from '@/components/navigation/desktop-nav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-background flex h-screen flex-col overflow-hidden"
      style={{ height: '100svh' }}
    >
      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Main Content Area - Usando flex-1 para ocupar espaço disponível */}
      <main className="flex-1 overflow-hidden px-4 pt-3 pb-20 md:px-6 md:pt-20 md:pb-8 lg:px-8">
        <div className="container mx-auto h-full max-w-7xl">{children}</div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
