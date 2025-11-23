import { TableSkeleton } from "@/components/loading-skeletons";

export default function ImportsLoading() {
  return (
    <div className="space-y-4 max-w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="h-4 w-64 rounded bg-muted" />
          </div>
          <div className="h-8 w-32 rounded bg-muted" />
        </div>
        <div className="h-20 rounded-md bg-muted" />
      </div>

      <TableSkeleton />
    </div>
  );
}
