import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function GameGridSkeleton() {
  return (
    <Card className="glass-card h-full overflow-hidden p-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="border-border/50 overflow-hidden py-0">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-2 p-2.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    </Card>
  )
}
