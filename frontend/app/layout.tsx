import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
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
          "min-h-screen bg-background text-foreground antialiased overflow-x-hidden" // 👈 added overflow-x-hidden
        )}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="flex flex-col min-h-screen overflow-x-hidden">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">
                  Artha Job Dashboard
                </span>
                <span className="text-xs text-muted-foreground">
                  Monitor imports, analytics, and data quality
                </span>
              </div>
            </header>
            <main className="flex-1 p-4 overflow-x-hidden">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
