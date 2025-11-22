import { Request, Response } from "express";
import { addSSEClient, removeSSEClient } from "../events/sse";

export function importsEventStream(req: Request, res: Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders?.();

  res.write(`event: connected\ndata: "ok"\n\n`);

  addSSEClient(res);

  req.on("close", () => {
    removeSSEClient(res);
    res.end();
  });
}
