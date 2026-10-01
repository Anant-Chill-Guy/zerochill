"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// reports one visit per page load; /bee itself is not counted
export function VisitBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/bee")) return;
    const body = JSON.stringify({ path: pathname });
    if (!navigator.sendBeacon?.("/api/visit", new Blob([body], { type: "application/json" }))) {
      fetch("/api/visit", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
