import {
  ApiResponse,
  ImportLog,
  AnalyticsSummary,
  JobsListResult,
  Job,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
}

export async function fetchImportLogs(
  limit = 20,
  skip = 0
): Promise<ImportLog[]> {
  const url = new URL("/api/imports/logs", API_BASE_URL);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("skip", String(skip));

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch import logs: ${res.statusText}`);
  }

  const json = (await res.json()) as ApiResponse<ImportLog[]>;
  return json.data;
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummary> {
  const url = new URL("/api/analytics/summary", API_BASE_URL);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch analytics: ${res.statusText}`);
  }

  const json = (await res.json()) as ApiResponse<AnalyticsSummary>;
  return json.data;
}

// 👇 NEW: list jobs
export async function fetchJobsList(params?: {
  page?: number;
  limit?: number;
  search?: string;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<JobsListResult> {
  const url = new URL("/api/jobs", API_BASE_URL);

  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.source) url.searchParams.set("source", params.source);
  if (params?.dateFrom) url.searchParams.set("dateFrom", params.dateFrom);
  if (params?.dateTo) url.searchParams.set("dateTo", params.dateTo);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch jobs: ${res.statusText}`);
  }

  const json = (await res.json()) as ApiResponse<JobsListResult>;
  return json.data;
}

export async function triggerImportOnBackend(
  feedUrl?: string
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/imports/run`, {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(feedUrl ? { feedUrl } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to trigger import: ${res.status} ${res.statusText} - ${text}`
    );
  }
}

export async function fetchJobById(id: string): Promise<Job> {
  const url = new URL(`/api/jobs/${id}`, API_BASE_URL);

  const res = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch job: ${res.statusText}`);
  }

  const json = (await res.json()) as ApiResponse<Job>;
  return json.data;
}
