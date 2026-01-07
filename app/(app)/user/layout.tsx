import type React from "react"
import { UserDesktopNav } from "@/components/navigation/user-desktop-nav"
import { UserMobileNav } from "@/components/navigation/user-mobile-nav"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <UserDesktopNav />
      <UserMobileNav />
      <main className="pt-14 pb-16 md:pb-0 min-h-screen">{children}</main>
    </>
  )
}
