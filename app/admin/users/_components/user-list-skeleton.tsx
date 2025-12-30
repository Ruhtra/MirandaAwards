import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function UserListSkeleton() {
  return (
    <Card className="glass-card overflow-hidden">
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Avatar skeleton */}
                  <Skeleton className="size-10 rounded-lg" />

                  <div className="flex-1 space-y-2">
                    {/* Name skeleton */}
                    <Skeleton className="h-5 w-40" />
                    {/* Email skeleton */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="size-3 rounded-full" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>

                  {/* Badge skeleton */}
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>

                {/* Date skeleton */}
                <div className="flex items-center gap-2 pl-[52px]">
                  <Skeleton className="size-3 rounded-full" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex gap-2">
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="size-8 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
