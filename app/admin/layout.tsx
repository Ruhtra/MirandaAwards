import type React from "react"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { DesktopNav } from "@/components/navigation/desktop-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Main Content Area */}
      <main className="pt-16 md:pt-20 pb-20 md:pb-8 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">{children}</div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  )
}
