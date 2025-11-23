import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobDetailLoading() {
  return (
    <div className="space-y-4 max-w-4xl">
      <Skeleton className="h-4 w-24" />
      <Card className="p-4 space-y-3">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-32" />
      </Card>
      <Card className="p-4 space-y-2">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </Card>
    </div>
  );
}
