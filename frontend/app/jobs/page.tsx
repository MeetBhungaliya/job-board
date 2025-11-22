import { fetchJobsList } from "@/lib/api";
import { JobsClient } from "./jobs-client";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const initial = await fetchJobsList({ page: 1, limit: 200 });
  return <JobsClient initial={initial} />;
}
