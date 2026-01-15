import type { Metadata } from "next"
import { AdminDashboardStats } from "./_components/admin-dashboard-stats"
import { QuickActions } from "./_components/quick-actions"
import { RecentActivity } from "./_components/recent-activity"

export const metadata: Metadata = {
  title: "Dashboard | Miranda Awards",
  description: "Painel administrativo do Miranda Awards",
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6 h-full overflow-y-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema Miranda Awards</p>
      </div>

      <AdminDashboardStats />

      <QuickActions />

      <RecentActivity />
    </div>
  )
}
