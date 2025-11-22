import { fetchImportLogs } from "@/lib/api";
import { ImportsClient } from "./imports-client";

export const dynamic = "force-dynamic";

export default async function ImportsPage() {
  const logs = await fetchImportLogs(200, 0);
  return <ImportsClient logs={logs} />;
}
