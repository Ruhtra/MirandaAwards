import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GamesSkeleton() {
    return (
        <div className="container mx-auto px-4 py-6 space-y-4 sm:space-y-6">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Filters Skeleton */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-24" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden py-0">
                        <Skeleton className="aspect-[3/4] w-full" />
                        <div className="p-3 space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-8" />
                                </div>
                                <Skeleton className="h-1.5 w-full" />
                            </div>
                            <div className="flex gap-1">
                                <Skeleton className="h-5 w-16" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
