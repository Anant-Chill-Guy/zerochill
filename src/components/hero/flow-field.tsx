"use client";

import { useEffect, useRef } from "react";

import type { Team } from "./ics-strata";

export function FlowField({ team }: { team: Team | null }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const teamRef = useRef<Team | null>(team);

  // draw loop reads the team every frame so keep the ref in sync
  useEffect(() => {
    teamRef.current = team;
  }, [team]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;

    // normalised so a resize re-lays them out without rebuilding packets
    const CONDUITS = [0.14, 0.28, 0.42, 0.5, 0.58, 0.72, 0.86];
    type Packet = { lane: number; x: number; speed: number; size: number };
    let packets: Packet[] = [];

    const seed = () => {
      packets = Array.from({ length: 46 }, (_, i) => ({
        lane: i % CONDUITS.length,
        x: Math.random(),
        speed: 0.05 + Math.random() * 0.14,
        size: 0.5 + Math.random() * 1.4,
      }));
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };

    const palette = (): [string, string, number] => {
      const t = teamRef.current;
      if (t === "blue") return ["#9dc4d8", "#2f5a70", 0.5];
      if (t === "red") return ["#ff8f6a", "#a81a06", 0.62];
      return ["#dfba8c", "#24160b", 0.34];
    };

    const draw = (dt: number) => {
      if (!w || !h) return;
      const [hot, cold, alpha] = palette();

      ctx.clearRect(0, 0, w, h);

      for (const c of CONDUITS) {
        const y = Math.round(c * h) + 0.5;
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(0.14, cold);
        grad.addColorStop(0.86, cold);
        grad.addColorStop(1, "transparent");
        ctx.globalAlpha = alpha * 0.34;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // packets ride the conduits in the team's direction
      ctx.globalCompositeOperation = "lighter";
      for (const p of packets) {
        const y = CONDUITS[p.lane] * h;
        const dir = teamRef.current === "blue" ? -1 : 1;
        const x = ((p.x * w) + dir * p.speed * w * dt) % (w * 1.4);
        const px = x < 0 ? x + w * 1.4 : x;

        const grad = ctx.createLinearGradient(px - 26, y, px + 6, y);
        grad.addColorStop(0, "transparent");
        grad.addColorStop(1, hot);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = grad;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(px - 26, y);
        ctx.lineTo(px, y);
        ctx.stroke();

        ctx.globalAlpha = alpha * 0.9;
        ctx.fillStyle = hot;
        ctx.fillRect(px - 1, y - p.size / 2, 2.4, p.size);

        p.x = x / w;
        if (p.x > 1.4) p.x -= 1.4;
        if (p.x < -0.4) p.x += 1.4;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      const dt = 1 / 60;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    seed();
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0 },
    );
    io.observe(canvas);

    if (reduce) {
      draw(0);
    } else {
      play();
    }

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
    />
  );
}
