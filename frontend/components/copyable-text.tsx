"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyableTextProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyableText({ text, label, className }: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  return (
    <div className={cn("flex items-start gap-2", className)}>
      <div className="flex-1 min-w-0">
        {label && (
          <p className="text-[11px] uppercase tracking-tight text-muted-foreground mb-0.5">
            {label}
          </p>
        )}
        <p className="text-xs font-mono break-all leading-snug">
          {text || "-"}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7 shrink-0 relative"
        onClick={handleCopy}
        title="Copy to clipboard"
      >
        <Copy className="h-3 w-3" />
        <span className="sr-only">Copy</span>
        {copied && (
          <span className="absolute -bottom-5 right-0 text-[10px] text-muted-foreground">
            Copied
          </span>
        )}
      </Button>
    </div>
  );
}
