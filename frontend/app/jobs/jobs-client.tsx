"use client";

import { useEffect, useMemo, useState } from "react";
import { Job, JobsListResult } from "@/lib/types";
import { jobColumns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchJobsList } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RefreshCcw } from "lucide-react";

type JobsTab = "all" | "recent" | "today";

interface JobsClientProps {
  initial: JobsListResult;
}

export function JobsClient({ initial }: JobsClientProps) {
  const [tab, setTab] = useState<JobsTab>("all");
  const [search, setSearch] = useState("");
  const [source, setSource] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [loading, setLoading] = useState(false);

  const [jobs, setJobs] = useState<Job[]>(initial.items);

  // Derived distinct sources for filter
  const sources = useMemo(
    () =>
      Array.from(
        new Set(
          jobs
            .map((j) => j.source)
            .filter((s): s is string => !!s && s.trim().length > 0)
        )
      ),
    [jobs]
  );

  const reload = async () => {
    setLoading(true);
    try {
      const result = await fetchJobsList({
        page: 1,
        limit: 200,
        search,
        source: source || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      });
      setJobs(result.items);
    } catch (err) {
      console.error("Failed to reload jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, [search, source, dateFrom, dateTo]);

  const filteredJobs = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    return jobs.filter((job) => {
      const posted = job.postedDate ? new Date(job.postedDate) : null;

      if (tab === "today" && posted) {
        if (posted < startOfToday) return false;
      }

      if (tab === "recent" && posted) {
        if (posted < sevenDaysAgo) return false;
      }

      return true;
    });
  }, [jobs, tab]);

  const resetFilters = () => {
    setSearch("");
    setSource("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-4 max-w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Job Listings
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse imported jobs with filters and open a detailed view.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={reload}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>

        <Card className="p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-end">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Search
                </label>
                <Input
                  placeholder="Search title, company or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-64"
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:w-52">
                <label className="text-xs font-medium text-muted-foreground">
                  Source
                </label>
                <Select
                  value={source}
                  onValueChange={(v) => setSource(v === "all" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All sources</SelectItem>
                    {sources.map((src) => (
                      <SelectItem key={src} value={src}>
                        {src.replace(/^https?:\/\//, "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                onClick={resetFilters}
              >
                Clear filters
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as JobsTab)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Last 7 days</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
        </TabsList>

        <div className="mt-3 max-w-full">
          <TabsContent value="all" className="mt-0">
            <DataTable columns={jobColumns} data={filteredJobs} />
          </TabsContent>
          <TabsContent value="recent" className="mt-0">
            <DataTable columns={jobColumns} data={filteredJobs} />
          </TabsContent>
          <TabsContent value="today" className="mt-0">
            <DataTable columns={jobColumns} data={filteredJobs} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
