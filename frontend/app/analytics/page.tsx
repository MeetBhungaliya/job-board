// app/analytics/page.tsx
import { fetchAnalyticsSummary } from "@/lib/api";
import { AnalyticsSummary } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  description
}: {
  label: string;
  value: string | number;
  description?: string;
}) {
  return (
    <Card className="p-4 flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
        {label}
      </span>
      <span className="text-2xl font-semibold">{value}</span>
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </Card>
  );
}

export default async function AnalyticsPage() {
  const summary: AnalyticsSummary = await fetchAnalyticsSummary();

  const {
    totalJobs,
    totalImports,
    totalNewJobs,
    totalUpdatedJobs,
    totalFailedJobs,
    lastImport,
    jobsBySource
  } = summary;

  const totalChanges = totalNewJobs + totalUpdatedJobs || 1;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Analytics Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          High-level metrics of job imports and data quality.
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total Jobs"
          value={totalJobs.toLocaleString()}
          description="Current jobs in database"
        />
        <StatCard
          label="Total Imports"
          value={totalImports.toLocaleString()}
          description="Number of import runs"
        />
        <StatCard
          label="New Jobs Imported"
          value={totalNewJobs.toLocaleString()}
          description="All imports combined"
        />
        <StatCard
          label="Updated Jobs"
          value={totalUpdatedJobs.toLocaleString()}
          description="Existing jobs refreshed"
        />
      </div>

      {/* Failures + last import */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
              Failures
            </span>
            <Badge variant="destructive" className="text-[11px]">
              {totalFailedJobs} total failures
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Sum of all failed jobs across all import runs. Use this to see data
            quality issues.
          </p>
          <p className="text-xs text-muted-foreground">
            New vs updated jobs ratio:{" "}
            <span className="font-medium text-foreground">
              {Math.round((totalNewJobs / totalChanges) * 100)}% new
            </span>
          </p>
        </Card>

        <Card className="p-4 flex flex-col gap-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
                Last Import
              </span>
              <h3 className="text-sm font-semibold mt-1">
                {lastImport ? "Most recent run" : "No imports yet"}
              </h3>
            </div>
            {lastImport && (
              <Badge variant={lastImport.failedJobs ? "destructive" : "outline"}>
                {lastImport.failedJobs ? "Has failures" : "Clean run"}
              </Badge>
            )}
          </div>

          {lastImport ? (
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Feed URL</p>
                <p className="text-xs font-mono break-all bg-muted/60 rounded-md p-2">
                  {lastImport.feedUrl}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">File Name</p>
                <p className="text-xs font-mono break-all bg-muted/60 rounded-md p-2">
                  {lastImport.fileName}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Started</p>
                <p className="text-xs">
                  {new Date(lastImport.startedAt).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Finished</p>
                <p className="text-xs">
                  {lastImport.finishedAt
                    ? new Date(lastImport.finishedAt).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Fetched / Imported
                </p>
                <p className="text-xs">
                  {lastImport.totalImported} / {lastImport.totalFetched}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">New / Updated</p>
                <p className="text-xs">
                  {lastImport.newJobs} new, {lastImport.updatedJobs} updated
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No imports have been executed yet.
            </p>
          )}
        </Card>
      </div>

      {/* Jobs by source */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
              Jobs by Source
            </span>
            <p className="text-sm text-muted-foreground">
              Distribution of jobs grouped by feed/source.
            </p>
          </div>
        </div>

        {jobsBySource.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No jobs yet. Run an import to see data.
          </p>
        ) : (
          <div className="space-y-2">
            {jobsBySource.map((item) => (
              <div
                key={item.source}
                className="flex items-center justify-between gap-4"
              >
                <p className="text-xs font-mono break-all flex-1">
                  {item.source || "unknown"}
                </p>
                <p className="text-xs text-muted-foreground w-20 text-right">
                  {item.count.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
