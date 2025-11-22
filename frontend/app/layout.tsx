import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Artha Job Admin",
  description: "Admin dashboard for Artha job imports"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased"
        )}
      >
        <div className="min-h-screen flex">
          <aside className="hidden md:flex w-64 border-r bg-muted/40 flex-col p-4 gap-4">
            <div className="text-lg font-semibold tracking-tight">
              Artha Admin
            </div>
            <nav className="flex flex-col gap-2 text-sm">
              <a
                href="/imports"
                className="px-2 py-1.5 rounded-md hover:bg-muted"
              >
                Import History
              </a>
            </nav>
          </aside>
          <main className="flex-1 flex flex-col">
            <header className="w-full border-b px-4 py-3 flex items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight">
                Job Import Dashboard
              </h1>
            </header>
            <div className="p-4">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
