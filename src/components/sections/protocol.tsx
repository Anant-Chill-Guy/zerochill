"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

// the standing rules — they hold for both phases, so they carry no dates
const RULES = [
  "Maximum 4 members per team",
  "No attacking infrastructure",
  "No sharing flags between teams",
  "Respect other participants",
  "Have fun and learn!",
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
        gsap.from(".pr-list--rules > li", {
          autoAlpha: 0,
          y: 18,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pr-list--rules", start: "top 84%" },
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
            These hold for every phase, online and off. Read them before you
            register.
          </p>
        </div>

        <ul className="pr-list pr-list--rules">
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
