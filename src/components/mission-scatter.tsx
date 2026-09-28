"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Line = { style: CSSProperties; text: ReactNode };

const LINES: Line[] = [
  {
    style: { left: "15%", top: "13%", maxWidth: "13rem" },
    text: "The network is fortified. The systems are isolated.",
  },
  {
    style: { left: "6%", top: "46%", maxWidth: "21rem" },
    text: "The defenses are waiting for those who dare to challenge them.",
  },
  {
    style: { left: "77%", top: "34%", maxWidth: "19rem" },
    text: "Your mission: infiltrate, exploit, and prove no barrier is unbreakable.",
  },
  {
    style: { left: "77%", top: "63%", maxWidth: "19rem" },
    text: "Enter the realm of technical espionage, where curiosity becomes capability.",
  },
  {
    style: { left: "38.5%", top: "81%", maxWidth: "23rem" },
    text: (
      <>
        Breach the{" "}
        <strong className="mission-accent">Physical Network</strong>, outsmart
        the architecture, and escape with the flag… if you can.
      </>
    ),
  },
];

export function MissionScatter() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        // pin the hero and reveal lines one by one
        const shell = el.closest<HTMLElement>(".hero-shell") ?? el;
        const lines = gsap.utils.toArray<HTMLElement>(".mission-line", el);
        gsap.set(lines, {
          autoAlpha: 0,
          y: 46,
          scale: 0.5,
          filter: "blur(14px)",
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: shell,
            start: "top top",
            end: "+=220%",
            pin: shell,
            scrub: true,
            anticipatePin: 1,
          },
        });
        lines.forEach((line, i) => {
          tl.to(
            line,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              ease: "back.out(1.7)",
              duration: 1,
            },
            i * 1.15,
          );
        });
      },
    );

    // reduced motion just shows the lines
    mm.add("(min-width: 768px) and (prefers-reduced-motion: reduce)", () => {
      gsap.set(gsap.utils.toArray<HTMLElement>(".mission-line", el), {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "none",
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-svh md:block"
    >
      {LINES.map((l, i) => (
        <p key={i} className="mission-line" style={l.style}>
          {l.text}
        </p>
      ))}
    </div>
  );
}
