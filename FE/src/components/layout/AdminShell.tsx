import type { ReactNode } from "react";
import { SessionSync } from "@/components/providers/SessionSync";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-canvas">
      <SessionSync />
      <Sidebar />
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 xl:p-7">{children}</main>
      </div>
    </div>
  );
}
