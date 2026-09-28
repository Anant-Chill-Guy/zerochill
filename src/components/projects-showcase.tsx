"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Project = {
  name: string;
  tagline: string;
  blurb: string;
  tint: string;
};

const PROJECTS: Project[] = [
  {
    name: "Skiper OSS 001",
    tagline: "Open-source groundwork",
    blurb:
      "The seed repository: primitives, tokens and the build rig everything else grows from. Public, unopinionated, and meant to be forked.",
    tint: "from-[#1f2a44] to-[#080f1c]",
  },
  {
    name: "NeonSync Pro",
    tagline: "Realtime state, everywhere",
    blurb:
      "A sync layer that keeps clients in lockstep over unreliable networks — conflict resolution, presence and offline queues without the ceremony.",
    tint: "from-[#3a1f4d] to-[#120a1c]",
  },
  {
    name: "PixelForge Studio",
    tagline: "Design-to-asset pipeline",
    blurb:
      "Batch-renders and grades visual assets straight from source files, so the art pipeline stops being a bottleneck and starts being a button.",
    tint: "from-[#4d2f14] to-[#180d05]",
  },
  {
    name: "TaskFlow Sonet",
    tagline: "Orchestration for agents",
    blurb:
      "Declarative task graphs that fan work across many workers, verify each step, and stitch the results back together — built for scale one context can't hold.",
    tint: "from-[#123a2f] to-[#06140f]",
  },
  {
    name: "CloudVibe Bruh",
    tagline: "Infra, but chill",
    blurb:
      "One command from empty account to running stack. Sensible defaults, reversible changes, and a plan you actually read before anything ships.",
    tint: "from-[#0f2f3a] to-[#061418]",
  },
];

export function ProjectsShowcase() {
  const [active, setActive] = useState(3);
  const scope = useRef<HTMLDivElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        coverRef.current,
        { autoAlpha: 0, scale: 1.06, xPercent: 3 },
        { autoAlpha: 1, scale: 1, xPercent: 0, duration: 0.7 },
        0,
      );
      const bits = copyRef.current?.children;
      if (bits) {
        tl.fromTo(
          bits,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08 },
          0.12,
        );
      }
    }, scope);
    return () => ctx.revert();
  }, [active]);

  const p = PROJECTS[active];

  return (
    <section
      ref={scope}
      className="relative flex min-h-svh w-full items-center overflow-hidden bg-[#FFFFC5] px-6 py-24 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="order-2 lg:order-1">
          <div
            ref={coverRef}
            className={`relative flex aspect-[16/10] w-full items-end overflow-hidden rounded-2xl bg-gradient-to-br ${p.tint} shadow-[0_30px_60px_-30px_rgba(30,20,8,0.5)] ring-1 ring-black/10`}
          >
            <span className="pointer-events-none absolute left-5 top-4 font-mono text-[0.62rem] uppercase tracking-[0.34em] text-white/45">
              {String(active + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none select-none px-6 pb-5 text-4xl font-semibold uppercase leading-none tracking-tight text-white/10 sm:text-6xl"
            >
              {p.name}
            </span>
          </div>

          <div ref={copyRef} className="mt-7 max-w-[48ch]">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-ember-700">
              {p.tagline}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#1a1008]">
              {p.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#1a1008]/70">
              {p.blurb}
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="mb-5 flex items-center gap-3 lg:justify-end">
            <span className="font-mono text-lg font-bold uppercase tracking-[0.34em] text-[#1a1008]/70">
              sudo cat important.md
            </span>
            <span className="h-px w-14 bg-[#1a1008]/20" />
          </div>

          <ul className="flex flex-col gap-1.5 lg:items-end lg:text-right">
            {PROJECTS.map((pr, i) => {
              const on = i === active;
              return (
                <li key={pr.name}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className={`text-2xl font-light tracking-tight transition-colors duration-200 sm:text-[1.7rem] ${
                      on
                        ? "text-[#1a1008]"
                        : "text-[#1a1008]/35 hover:text-[#1a1008]/65"
                    }`}
                  >
                    {pr.name}
                    {on && <span className="text-ember-600"> ·</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
