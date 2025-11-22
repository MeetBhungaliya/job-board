"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RefreshCcw } from "lucide-react";
import { useState, useTransition } from "react";
import { triggerImport } from "./actions";

export function ImportToolbar() {
  const [isPending, startTransition] = useTransition();
  const [feedUrl, setFeedUrl] = useState("");

  const onRunAll = () => {
    startTransition(async () => {
      await triggerImport(new FormData());
    });
  };

  const onRunSingle = () => {
    const formData = new FormData();
    if (feedUrl.trim()) {
      formData.set("feedUrl", feedUrl.trim());
    }
    startTransition(async () => {
      await triggerImport(formData);
    });
  };

  return (
    <Card className="p-4 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold">Job Imports</h2>
        <p className="text-sm text-muted-foreground">
          Trigger RSS imports and view the history of previous runs.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
        <div className="flex gap-2">
          <Input
            placeholder="Optional feed URL (override)"
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            className="w-64"
          />
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={onRunSingle}
          >
            {isPending ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              "Run Single Feed"
            )}
          </Button>
        </div>
        <Button
          type="button"
          disabled={isPending}
          onClick={onRunAll}
          className="whitespace-nowrap"
        >
          {isPending ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Running All Feeds...
            </>
          ) : (
            "Run All Feeds"
          )}
        </Button>
      </div>
    </Card>
  );
}
