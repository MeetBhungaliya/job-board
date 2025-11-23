
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Top stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>

      {/* Lower cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-32" />
        </Card>
        <Card className="p-4 space-y-3 lg:col-span-2">
          <Skeleton className="h-3 w-24" />
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Jobs by source */}
      <Card className="p-4 space-y-3">
        <Skeleton className="h-3 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <Skeleton className="h-3 w-44" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </Card>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-2 max-w-full">
      <div className="rounded-md border max-w-full overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header row */}
          <div className="flex border-b px-4 py-2 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-24" />
            ))}
          </div>
          {/* Body rows */}
          {Array.from({ length: 5 }).map((_, row) => (
            <div
              key={row}
              className="flex items-center gap-4 border-b px-4 py-3"
            >
              {Array.from({ length: 5 }).map((_, col) => (
                <Skeleton key={col} className="h-3 w-24" />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
}
