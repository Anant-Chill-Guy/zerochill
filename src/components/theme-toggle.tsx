"use client";

import { useTheme } from "@/components/use-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isDeep = theme === "deep";

  const toggle = () => setTheme(isDeep ? "default" : "deep");

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle${className ? ` ${className}` : ""}`}
      aria-pressed={isDeep}
      aria-label={isDeep ? "Switch to the signal palette" : "Switch to the deep palette"}
      title="Switch palette"
    >
      <span className="theme-toggle__icon" data-state={isDeep ? "moon" : "sun"}>
        <span className="theme-toggle__disc" />
        <span className="theme-toggle__rays" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </span>
      </span>
    </button>
  );
}
