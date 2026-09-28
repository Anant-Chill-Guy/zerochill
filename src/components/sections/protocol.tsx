"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { Spectrum } from "@/components/spectrum";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: "01",
    title: "Form your cell",
    desc: "Bring a small team. Each operator owns a different domain.",
  },
  {
    n: "02",
    title: "Request clearance",
    desc: "Register to receive your entry vector into the facility.",
  },
  {
    n: "03",
    title: "Run the breach",
    desc: "Work the chain live: recon, foothold, pivot, control.",
  },
  {
    n: "04",
    title: "Bank the flags",
    desc: "Submit proof of each capture. The board moves in real time.",
  },
];

export function Protocol() {
  const root = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pr-head > *", {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pr-head", start: "top 80%" },
        });
        gsap.from(".pr-step", {
          autoAlpha: 0,
          y: 18,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pr-steps", start: "top 84%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="rules" ref={root} className="pr-section">
      <div className="pr-inner">
        <div className="pr-head">
          <h2 className="pr-title">Rules of engagement</h2>
          <p className="pr-intro">
            Four moves from the outside to the board. This is how a run plays
            out. Exact windows and scoring land closer to launch.
          </p>
        </div>

        <Spectrum className="pr-strip" />

        <ol className="pr-steps">
          {STEPS.map((s) => (
            <li key={s.n} className="pr-step">
              <span className="pr-step__idx">{s.n}</span>
              <h3 className="pr-step__title">{s.title}</h3>
              <p className="pr-step__desc">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
