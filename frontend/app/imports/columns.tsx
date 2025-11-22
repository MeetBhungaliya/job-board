"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ImportLog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CopyableText } from "@/components/copyable-text";

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export const importColumns: ColumnDef<ImportLog>[] = [
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const log = row.original;
      const failedCount = log.failedJobs?.length ?? 0;
      const isCompleted = !!log.finishedAt;
      const hasFailure = failedCount > 0;

      if (!isCompleted) {
        return (
          <Badge variant="secondary" className="text-[11px]">
            Running
          </Badge>
        );
      }

      if (hasFailure) {
        return (
          <Badge variant="destructive" className="text-[11px]">
            Failed ({failedCount})
          </Badge>
        );
      }

      return (
        <Badge variant="outline" className="text-[11px]">
          Completed
        </Badge>
      );
    }
  },
  {
    accessorKey: "feedUrl",
    header: "Feed URL",
    cell: ({ row }) => (
      <CopyableText text={row.original.feedUrl} label="Feed" />
    )
  },
  {
    accessorKey: "fileName",
    header: "File Name",
    cell: ({ row }) => (
      <CopyableText text={row.original.fileName} label="File" />
    )
  },
  {
    accessorKey: "startedAt",
    header: "Started",
    cell: ({ row }) => (
      <p className="text-xs">{formatDate(row.original.startedAt)}</p>
    )
  },
  {
    accessorKey: "finishedAt",
    header: "Finished",
    cell: ({ row }) => (
      <p className="text-xs">{formatDate(row.original.finishedAt)}</p>
    )
  },
  {
    accessorKey: "totalFetched",
    header: "Fetched",
    cell: ({ row }) => (
      <p className="text-right text-xs">{row.original.totalFetched}</p>
    )
  },
  {
    accessorKey: "totalImported",
    header: "Imported",
    cell: ({ row }) => (
      <p className="text-right text-xs">{row.original.totalImported}</p>
    )
  },
  {
    accessorKey: "newJobs",
    header: "New",
    cell: ({ row }) => (
      <p className="text-right text-xs">{row.original.newJobs}</p>
    )
  },
  {
    accessorKey: "updatedJobs",
    header: "Updated",
    cell: ({ row }) => (
      <p className="text-right text-xs">{row.original.updatedJobs}</p>
    )
  }
];
