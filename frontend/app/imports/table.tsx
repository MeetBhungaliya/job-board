import { ImportLog } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function calculateStatus(log: ImportLog): "completed" | "running" {
  if (log.finishedAt) return "completed";
  return "running";
}

export function ImportTable({ logs }: { logs: ImportLog[] }) {
  return (
    <Card className="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[230px]">Feed</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead className="w-[180px]">Started</TableHead>
            <TableHead className="w-[180px]">Finished</TableHead>
            <TableHead className="text-right">Fetched</TableHead>
            <TableHead className="text-right">Imported</TableHead>
            <TableHead className="text-right">New</TableHead>
            <TableHead className="text-right">Updated</TableHead>
            <TableHead className="text-right">Failed</TableHead>
            <TableHead className="w-[120px] text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8">
                <span className="text-sm text-muted-foreground">
                  No import runs yet. Click &quot;Run All Feeds&quot; to start
                  an import.
                </span>
              </TableCell>
            </TableRow>
          ) : (
            logs.map((log) => {
              const status = calculateStatus(log);
              const failedCount = log.failedJobs?.length ?? 0;

              return (
                <TableRow key={log._id}>
                  <TableCell className="max-w-[230px] truncate">
                    <span title={log.feedUrl}>{log.feedUrl}</span>
                  </TableCell>
                  <TableCell className="max-w-[260px] truncate">
                    <span title={log.fileName}>{log.fileName}</span>
                  </TableCell>
                  <TableCell>{formatDate(log.startedAt)}</TableCell>
                  <TableCell>{formatDate(log.finishedAt)}</TableCell>
                  <TableCell className="text-right">
                    {log.totalFetched}
                  </TableCell>
                  <TableCell className="text-right">
                    {log.totalImported}
                  </TableCell>
                  <TableCell className="text-right">
                    {log.newJobs}
                  </TableCell>
                  <TableCell className="text-right">
                    {log.updatedJobs}
                  </TableCell>
                  <TableCell className="text-right">
                    {failedCount > 0 ? (
                      <Badge variant="destructive">{failedCount}</Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {status === "completed" ? (
                      <Badge variant="outline">Completed</Badge>
                    ) : (
                      <Badge variant="secondary">Running</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
