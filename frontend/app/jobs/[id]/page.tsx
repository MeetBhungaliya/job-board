import { fetchJobById } from "@/lib/api";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  let job;
  try {
    const { id } = await params
    job = await fetchJobById(id);
  } catch {
    return notFound();
  }

  if (!job) return notFound();

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to jobs
        </Link>
      </div>

      <Card className="p-4 space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {job.company && <span>{job.company}</span>}
          {job.location && (
            <>
              <span>•</span>
              <span>{job.location}</span>
            </>
          )}
          {job.category && (
            <>
              <span>•</span>
              <span>{job.category}</span>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {job.source && (
            <Badge variant="outline" className="text-[11px]">
              {job.source.replace(/^https?:\/\//, "")}
            </Badge>
          )}
          <Badge variant="secondary" className="text-[11px]">
            Posted: {formatDate(job.postedDate)}
          </Badge>
        </div>
        {job.jobUrl && (
          <div className="mt-2">
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              View original listing
            </a>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="text-sm font-semibold mb-2">Job Description</h2>
        {job.description ? (
          <div
            className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No description available.
          </p>
        )}
      </Card>
    </div>
  );
}
