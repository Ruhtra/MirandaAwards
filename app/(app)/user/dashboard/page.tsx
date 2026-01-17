import { Suspense } from 'react'
import { PendingVotesCard } from './_components/pending-votes-card'
import { StatsCards } from './_components/stats-cards'
import { RecentActivity } from './_components/recent-activity'

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-6 px-4 py-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Acompanhe suas votações e estatísticas</p>
      </div>

      <Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-lg" />}>
        <StatsCards />
      </Suspense>

      <Suspense fallback={<div className="bg-muted h-96 animate-pulse rounded-lg" />}>
        <PendingVotesCard />
      </Suspense>

      <Suspense fallback={<div className="bg-muted h-64 animate-pulse rounded-lg" />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}
