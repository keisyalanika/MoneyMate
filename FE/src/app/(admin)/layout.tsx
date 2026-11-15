import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const store = await cookies();
  if (!store.get("mm_token")?.value) {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
