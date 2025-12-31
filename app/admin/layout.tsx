import type React from "react"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { DesktopNav } from "@/components/navigation/desktop-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden" style={{ height: "100svh" }}>
      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Main Content Area - Usando flex-1 para ocupar espaço disponível */}
      <main className="flex-1 overflow-hidden pt-3 md:pt-20 pb-20 md:pb-8 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl h-full">{children}</div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
