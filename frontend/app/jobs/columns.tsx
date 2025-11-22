"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Job } from "@/lib/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

export const jobColumns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: "Job Title",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <Link
            href={`/jobs/${job._id}`}
            className="text-sm font-medium hover:underline"
          >
            {job.title}
          </Link>
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
            {job.company && <span>{job.company}</span>}
            {job.location && (
              <>
                <span>•</span>
                <span>{job.location}</span>
              </>
            )}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const src = row.original.source || "unknown";
      return (
        <Badge variant="outline" className="text-[11px]">
          {src.replace(/^https?:\/\//, "")}
        </Badge>
      );
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.category || "-"}
      </span>
    )
  },
  {
    accessorKey: "postedDate",
    header: "Posted",
    cell: ({ row }) => (
      <span className="text-xs">{formatDate(row.original.postedDate)}</span>
    )
  }
];
