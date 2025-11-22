import { fetchImportLogs } from "@/lib/api";
import { ImportLog } from "@/lib/types";
import { ImportToolbar } from "./toolbar";
import { ImportTable } from "./table";

export const dynamic = "force-dynamic"; // always fetch fresh

export default async function ImportsPage() {
  const logs = await fetchImportLogs(50, 0);

  return (
    <div className="flex flex-col gap-4">
      <ImportToolbar />
      <ImportTable logs={logs} />
    </div>
  );
}
