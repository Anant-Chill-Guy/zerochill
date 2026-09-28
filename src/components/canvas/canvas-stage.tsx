"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export type CanvasFrame = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  time: number;
  dt: number;
  frame: number;
};

export type CanvasDraw = (frame: CanvasFrame) => void;

export type CanvasSetup = (
  ctx: CanvasRenderingContext2D,
  size: { width: number; height: number; dpr: number },
) => CanvasDraw | void;

type Props = {
  render?: CanvasDraw;
  setup?: CanvasSetup;
  animate?: boolean;
  autoClear?: boolean;
  maxDpr?: number;
  className?: string;
  style?: CSSProperties;
};

export function CanvasStage({
  render,
  setup,
  animate = true,
  autoClear = true,
  maxDpr = 2,
  className = "",
  style,
}: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // keep the latest callbacks without re-running the effect
  const renderRef = useRef(render);
  const setupRef = useRef(setup);
  renderRef.current = render;
  setupRef.current = setup;

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const looping = animate && !reduce;

    const size = { width: 0, height: 0, dpr: 1 };
    let draw: CanvasDraw | void = renderRef.current;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      size.width = width;
      size.height = height;
      size.dpr = dpr;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // setup may return its own draw fn otherwise fall back to render
      draw = setupRef.current?.(ctx, { width, height, dpr }) ?? renderRef.current;
      if (!looping) paint(performance.now());
    };

    let raf = 0;
    let start: number | null = null;
    let last = 0;
    let frame = 0;

    const paint = (t: number) => {
      if (start === null) {
        start = t;
        last = t;
      }
      const time = (t - start) / 1000;
      const dt = (t - last) / 1000;
      last = t;
      if (autoClear) ctx.clearRect(0, 0, size.width, size.height);
      (draw ?? renderRef.current)?.({
        ctx,
        width: size.width,
        height: size.height,
        dpr: size.dpr,
        time,
        dt,
        frame,
      });
      frame += 1;
    };

    const loop = (t: number) => {
      paint(t);
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    if (looping) raf = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [animate, autoClear, maxDpr]);

  return (
    <div ref={wrapRef} className={className} style={style}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
