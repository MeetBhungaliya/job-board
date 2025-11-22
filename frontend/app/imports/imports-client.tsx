"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImportLog } from "@/lib/types";
import { RefreshCcw } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { triggerImport } from "./actions";
import { importColumns } from "./columns";

type StatusFilter = "all" | "failed" | "clean";

interface ImportsClientProps {
  logs: ImportLog[];
}

function applyFilters(
  logs: ImportLog[],
  {
    status,
    search,
    dateFrom,
    dateTo
  }: {
    status: StatusFilter;
    search: string;
    dateFrom: string;
    dateTo: string;
  }
) {
  return logs.filter((log) => {
    const failedCount = log.failedJobs?.length ?? 0;
    const isClean = failedCount === 0;
    const isFailed = failedCount > 0;

    if (status === "failed" && !isFailed) return false;
    if (status === "clean" && !isClean) return false;

    if (search) {
      const s = search.toLowerCase();
      const match =
        log.feedUrl.toLowerCase().includes(s) ||
        log.fileName.toLowerCase().includes(s);
      if (!match) return false;
    }

    if (dateFrom) {
      const from = new Date(dateFrom);
      const started = new Date(log.startedAt);
      if (started < from) return false;
    }

    if (dateTo) {
      const to = new Date(dateTo);
      const started = new Date(log.startedAt);
      // include full day
      to.setHours(23, 59, 59, 999);
      if (started > to) return false;
    }

    return true;
  });
}

export function ImportsClient({ logs }: ImportsClientProps) {
  const [tab, setTab] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isPending, startTransition] = useTransition();

  const allFiltered = useMemo(
    () => applyFilters(logs, { status: "all", search, dateFrom, dateTo }),
    [logs, search, dateFrom, dateTo]
  );
  const failedFiltered = useMemo(
    () => applyFilters(logs, { status: "failed", search, dateFrom, dateTo }),
    [logs, search, dateFrom, dateTo]
  );
  const cleanFiltered = useMemo(
    () => applyFilters(logs, { status: "clean", search, dateFrom, dateTo }),
    [logs, search, dateFrom, dateTo]
  );

  const onRunAll = () => {
    startTransition(async () => {
      const fd = new FormData();
      await triggerImport(fd);
    });
  };

  return (
    <div className="space-y-4">
      {/* Header + actions */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Import History
            </h2>
            <p className="text-sm text-muted-foreground">
              View and filter all import runs across feeds.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              disabled={isPending}
              onClick={onRunAll}
              className="whitespace-nowrap"
            >
              {isPending ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Running imports...
                </>
              ) : (
                "Run All Feeds"
              )}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Search
                </label>
                <Input
                  placeholder="Search by feed or file name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-64"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    From
                  </label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    To
                  </label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => {
                  setSearch("");
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Clear filters
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as StatusFilter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="clean">Successful</TabsTrigger>
        </TabsList>
        <div className="mt-3 max-w-full">
          <TabsContent value="all" className="mt-0">
            <DataTable columns={importColumns} data={allFiltered} />
          </TabsContent>
          <TabsContent value="failed" className="mt-0">
            <DataTable columns={importColumns} data={failedFiltered} />
          </TabsContent>
          <TabsContent value="clean" className="mt-0">
            <DataTable columns={importColumns} data={cleanFiltered} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
