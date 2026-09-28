"use client";

import { useEffect, useState } from "react";

export type Theme = "default" | "deep";

const STORAGE_KEY = "void-theme";

function readTheme(): Theme {
  if (typeof document === "undefined") return "default";
  return document.documentElement.getAttribute("data-theme") === "deep"
    ? "deep"
    : "default";
}

/**
 * Reads/writes the active palette via the `data-theme` attribute on <html>.
 * A MutationObserver keeps every consumer (toggle, hero background, …) in sync
 * from a single source of truth, so any component can both read and set it.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("default");

  useEffect(() => {
    setThemeState(readTheme());

    const observer = new MutationObserver(() => setThemeState(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // keep tabs in sync
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const el = document.documentElement;
      if (e.newValue === "deep") el.setAttribute("data-theme", "deep");
      else el.removeAttribute("data-theme");
    };
    window.addEventListener("storage", onStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = (next: Theme) => {
    const el = document.documentElement;
    if (next === "deep") el.setAttribute("data-theme", "deep");
    else el.removeAttribute("data-theme");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable (private mode) — theme still applies for the session
    }
    // the MutationObserver above propagates the new value to all consumers
  };

  return { theme, setTheme };
}
