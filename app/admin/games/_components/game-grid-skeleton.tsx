import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GameGridSkeleton() {
  return (
    <Card className="glass-card overflow-hidden h-full p-3 ">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/50 py-0">
            <Skeleton className="aspect-square w-full" />
            <div className="p-2.5 space-y-2">
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
