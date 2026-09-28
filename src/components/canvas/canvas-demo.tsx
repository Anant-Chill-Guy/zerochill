"use client";

import { CanvasStage, type CanvasFrame } from "./canvas-stage";

export function CanvasDemo({ className = "" }: { className?: string }) {
  return <CanvasStage className={className} render={draw} />;
}

function draw({ ctx, width, height, time }: CanvasFrame) {
  // placeholder field of pulsing dots
  const gap = 46;
  ctx.fillStyle = "#1a1008";
  for (let y = gap; y < height; y += gap) {
    for (let x = gap; x < width; x += gap) {
      const p = 0.5 + 0.5 * Math.sin(time * 1.4 + (x + y) * 0.012);
      ctx.globalAlpha = 0.1 + p * 0.16;
      ctx.beginPath();
      ctx.arc(x, y, 1 + p * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}
