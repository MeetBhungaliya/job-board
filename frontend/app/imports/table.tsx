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
import { CopyableText } from "@/components/copyable-text";

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function calculateStatus(log: ImportLog): "completed" | "running" {
  return log.finishedAt ? "completed" : "running";
}

export function ImportTable({ logs }: { logs: ImportLog[] }) {
  return (
    <Card className="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[260px]">Feed URL</TableHead>
            <TableHead className="w-[260px]">File Name</TableHead>
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
                  <TableCell className="align-top">
                    <CopyableText text={log.feedUrl} label="Feed" />
                  </TableCell>
                  <TableCell className="align-top">
                    <CopyableText text={log.fileName} label="File" />
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-xs">{formatDate(log.startedAt)}</p>
                  </TableCell>
                  <TableCell className="align-top">
                    <p className="text-xs">{formatDate(log.finishedAt)}</p>
                  </TableCell>
                  <TableCell className="text-right align-top text-xs">
                    {log.totalFetched}
                  </TableCell>
                  <TableCell className="text-right align-top text-xs">
                    {log.totalImported}
                  </TableCell>
                  <TableCell className="text-right align-top text-xs">
                    {log.newJobs}
                  </TableCell>
                  <TableCell className="text-right align-top text-xs">
                    {log.updatedJobs}
                  </TableCell>
                  <TableCell className="text-right align-top text-xs">
                    {failedCount > 0 ? (
                      <Badge variant="destructive" className="text-[11px]">
                        {failedCount}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right align-top">
                    {status === "completed" ? (
                      <Badge variant="outline" className="text-[11px]">
                        Completed
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[11px]">
                        Running
                      </Badge>
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
