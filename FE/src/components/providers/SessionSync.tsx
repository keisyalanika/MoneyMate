"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function SessionSync() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401 || response.status === 403) {
          window.location.replace("/login");
          return null;
        }
        if (!response.ok) return null;
        return response.json();
      })
      .then((payload) => {
        if (active && payload?.user) setUser(payload.user);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [setUser]);

  return null;
}
