import { Response } from "express";

type SSEClient = Response;

const clients: SSEClient[] = [];

export function addSSEClient(res: Response): void {
  clients.push(res);
}

export function removeSSEClient(res: Response): void {
  const idx = clients.indexOf(res);
  if (idx !== -1) {
    clients.splice(idx, 1);
  }
}

export function broadcastSSE(event: string, data: unknown): void {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

  for (const client of clients) {
    try {
      client.write(payload);
    } catch {}
  }
}
