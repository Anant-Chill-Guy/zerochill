"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const STATUS = [
  { k: "Sys", v: "Void-04", accent: false, dot: false },
  { k: "Network", v: "Air-Gapped", accent: false, dot: false },
  { k: "Threat", v: "Level IV", accent: true, dot: true },
] as const;

export function HeroFooter() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(root.current, {
          autoAlpha: 0,
          y: 18,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.1,
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-[1440px] flex-col items-center gap-5 px-6 pb-7 md:flex-row md:items-end md:justify-between lg:px-10"
    >
      <div className="status-strip">
        {STATUS.map((s, i) => (
          <div key={s.k} className="flex items-end gap-4 md:gap-6">
            {i > 0 && <span className="status-div hidden sm:block" aria-hidden="true" />}
            <div className="status-cell">
              <span className="status-cell__k">{s.k}</span>
              <span className="status-cell__v" data-accent={s.accent}>
                {s.dot && <span className="status-dot" aria-hidden="true" />}
                {s.v}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="scroll-cue">
        <span className="scroll-cue__idx">01</span>
        <span>Scroll to enter</span>
        <span className="scroll-cue__rail" aria-hidden="true" />
      </div>
    </div>
  );
}
