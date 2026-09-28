import type { CSSProperties } from "react";

export function Spectrum({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`spectrum ${className}`} style={style} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
